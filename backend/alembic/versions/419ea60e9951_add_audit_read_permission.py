"""add audit read permission

Revision ID: AUTO
Revises: ba5f5d99214e
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "419ea60e9951"
down_revision: Union[str, Sequence[str], None] = "ba5f5d99214e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    permissions = sa.table(
        "permissions",
        sa.column("id", sa.String),
        sa.column("code", sa.String),
        sa.column("name", sa.String),
        sa.column("description", sa.Text),
    )

    roles = sa.table(
        "roles",
        sa.column("id", sa.String),
        sa.column("code", sa.String),
        sa.column("is_system", sa.Boolean),
    )

    role_permissions = sa.table(
        "role_permissions",
        sa.column("role_id", sa.String),
        sa.column("permission_id", sa.String),
    )

    bind = op.get_bind()

    existing = bind.execute(
        sa.select(permissions.c.id).where(
            permissions.c.code == "audit.read"
        )
    ).first()

    if existing:
        permission_id = existing[0]
    else:
        import uuid

        permission_id = str(uuid.uuid4())

        bind.execute(
            permissions.insert().values(
                id=permission_id,
                code="audit.read",
                name="View Audit Trail",
                description="View institution audit trail activity.",
            )
        )

    system_roles = bind.execute(
        sa.select(roles.c.id).where(
            sa.or_(
                roles.c.is_system.is_(True),
                roles.c.code.in_(["admin", "administrator"]),
            )
        )
    ).fetchall()

    for role in system_roles:
        role_id = role[0]

        exists = bind.execute(
            sa.select(role_permissions.c.role_id).where(
                sa.and_(
                    role_permissions.c.role_id == role_id,
                    role_permissions.c.permission_id == permission_id,
                )
            )
        ).first()

        if not exists:
            bind.execute(
                role_permissions.insert().values(
                    role_id=role_id,
                    permission_id=permission_id,
                )
            )


def downgrade() -> None:
    bind = op.get_bind()

    permission = bind.execute(
        sa.text(
            "SELECT id FROM permissions WHERE code = 'audit.read'"
        )
    ).first()

    if permission:
        permission_id = permission[0]

        bind.execute(
            sa.text(
                "DELETE FROM role_permissions "
                "WHERE permission_id = :permission_id"
            ),
            {"permission_id": permission_id},
        )

        bind.execute(
            sa.text(
                "DELETE FROM permissions "
                "WHERE id = :permission_id"
            ),
            {"permission_id": permission_id},
        )
