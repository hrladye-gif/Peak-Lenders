"""add roles and permissions

Revision ID: a9b3e55ce3d4
Revises: c9cb7e7d8ca7
Create Date: 2026-09-07

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import uuid


revision: str = "a9b3e55ce3d4"
down_revision: Union[str, Sequence[str], None] = "c9cb7e7d8ca7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# These are system permission definitions, not tenant data.
PERMISSIONS = [
    ("users.read", "View Users", "View users within the tenant."),
    ("users.manage", "Manage Users", "Create, update, and deactivate users."),
    ("roles.read", "View Roles", "View roles and permissions."),
    ("roles.manage", "Manage Roles", "Create roles and assign permissions."),
    ("branches.read", "View Branches", "View tenant branches."),
    ("branches.manage", "Manage Branches", "Create and manage tenant branches."),
    ("settings.read", "View Settings", "View tenant settings."),
    ("settings.manage", "Manage Settings", "Change tenant settings."),
]


def upgrade() -> None:
    op.create_table(
        "permissions",
        sa.Column("code", sa.String(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "id",
            sa.String(),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        op.f("ix_permissions_code"),
        "permissions",
        ["code"],
        unique=True,
    )

    op.create_table(
        "roles",
        sa.Column("tenant_id", sa.String(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("code", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=True),
        sa.Column("is_system", sa.Boolean(), nullable=False),
        sa.Column(
            "id",
            sa.String(),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(
            ["tenant_id"],
            ["tenants.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "tenant_id",
            "code",
            name="uq_roles_tenant_code",
        ),
        sa.UniqueConstraint(
            "tenant_id",
            "name",
            name="uq_roles_tenant_name",
        ),
    )

    op.create_index(
        op.f("ix_roles_tenant_id"),
        "roles",
        ["tenant_id"],
        unique=False,
    )

    op.create_table(
        "role_permissions",
        sa.Column("role_id", sa.String(), nullable=False),
        sa.Column("permission_id", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(
            ["permission_id"],
            ["permissions.id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["role_id"],
            ["roles.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("role_id", "permission_id"),
    )

    op.create_table(
        "user_roles",
        sa.Column("user_id", sa.String(), nullable=False),
        sa.Column("role_id", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(
            ["role_id"],
            ["roles.id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("user_id", "role_id"),
    )

    # ------------------------------------------------------------
    # Seed the fixed system permission catalog.
    # ------------------------------------------------------------
    permissions_table = sa.table(
        "permissions",
        sa.column("id", sa.String()),
        sa.column("code", sa.String()),
        sa.column("name", sa.String()),
        sa.column("description", sa.Text()),
    )

    permission_rows = []

    for code, name, description in PERMISSIONS:
        permission_rows.append(
            {
                "id": str(uuid.uuid4()),
                "code": code,
                "name": name,
                "description": description,
            }
        )

    op.bulk_insert(permissions_table, permission_rows)

    # ------------------------------------------------------------
    # Create one role for every existing users.role value in each
    # existing tenant, then assign each existing user to that role.
    #
    # This migrates existing production data; it does not fabricate
    # users or tenants.
    # ------------------------------------------------------------
    connection = op.get_bind()

    users = connection.execute(
        sa.text(
            """
            SELECT id, tenant_id, role
            FROM users
            ORDER BY tenant_id, role, id
            """
        )
    ).mappings().all()

    roles_table = sa.table(
        "roles",
        sa.column("id", sa.String()),
        sa.column("tenant_id", sa.String()),
        sa.column("name", sa.String()),
        sa.column("code", sa.String()),
        sa.column("description", sa.String()),
        sa.column("is_system", sa.Boolean()),
    )

    user_roles_table = sa.table(
        "user_roles",
        sa.column("user_id", sa.String()),
        sa.column("role_id", sa.String()),
    )

    role_ids = {}

    for user in users:
        tenant_id = user["tenant_id"]
        raw_role = str(user["role"] or "").strip().lower()

        if not raw_role:
            continue

        key = (tenant_id, raw_role)

        if key not in role_ids:
            role_id = str(uuid.uuid4())

            display_name = (
                "Administrator"
                if raw_role in {"admin", "administrator"}
                else raw_role.replace("_", " ").replace("-", " ").title()
            )

            connection.execute(
                sa.text(
                    """
                    INSERT INTO roles
                        (id, tenant_id, name, code, description, is_system)
                    VALUES
                        (:id, :tenant_id, :name, :code, :description, :is_system)
                    """
                ),
                {
                    "id": role_id,
                    "tenant_id": tenant_id,
                    "name": display_name,
                    "code": raw_role,
                    "description": (
                        "Migrated from the existing users.role field."
                    ),
                    "is_system": raw_role
                    in {"admin", "administrator"},
                },
            )

            role_ids[key] = role_id

        connection.execute(
            sa.text(
                """
                INSERT INTO user_roles (user_id, role_id)
                VALUES (:user_id, :role_id)
                ON CONFLICT DO NOTHING
                """
            ),
            {
                "user_id": user["id"],
                "role_id": role_ids[key],
            },
        )

    # Existing administrators retain their current administrative
    # capability through the new RBAC layer.
    admin_permission_codes = {
        code for code, _, _ in PERMISSIONS
    }

    permission_ids = {
        row["code"]: row["id"]
        for row in connection.execute(
            sa.text(
                """
                SELECT id, code
                FROM permissions
                """
            )
        ).mappings()
    }

    admin_roles = connection.execute(
        sa.text(
            """
            SELECT id
            FROM roles
            WHERE is_system = TRUE
            """
        )
    ).mappings().all()

    for role in admin_roles:
        for code in admin_permission_codes:
            connection.execute(
                sa.text(
                    """
                    INSERT INTO role_permissions (role_id, permission_id)
                    VALUES (:role_id, :permission_id)
                    ON CONFLICT DO NOTHING
                    """
                ),
                {
                    "role_id": role["id"],
                    "permission_id": permission_ids[code],
                },
            )


def downgrade() -> None:
    op.drop_table("user_roles")
    op.drop_table("role_permissions")
    op.drop_index(
        op.f("ix_roles_tenant_id"),
        table_name="roles",
    )
    op.drop_table("roles")
    op.drop_index(
        op.f("ix_permissions_code"),
        table_name="permissions",
    )
    op.drop_table("permissions")
