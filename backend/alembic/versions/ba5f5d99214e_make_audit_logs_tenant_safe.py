"""make audit logs tenant safe

Revision ID: AUTO
Revises: f85ae4e40c62
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "ba5f5d99214e"
down_revision: Union[str, Sequence[str], None] = "f85ae4e40c62"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "audit_logs",
        sa.Column("tenant_id", sa.String(), nullable=True),
    )

    op.create_index(
        "ix_audit_logs_tenant_id",
        "audit_logs",
        ["tenant_id"],
        unique=False,
    )

    op.create_foreign_key(
        "fk_audit_logs_tenant_id_tenants",
        "audit_logs",
        "tenants",
        ["tenant_id"],
        ["id"],
    )

    op.create_foreign_key(
        "fk_audit_logs_performed_by_users",
        "audit_logs",
        "users",
        ["performed_by"],
        ["id"],
    )

    op.alter_column(
        "audit_logs",
        "tenant_id",
        nullable=False,
    )

    op.create_index(
        "ix_audit_logs_tenant_event_time",
        "audit_logs",
        ["tenant_id", "event_time"],
        unique=False,
    )

    op.create_index(
        "ix_audit_logs_tenant_entity",
        "audit_logs",
        ["tenant_id", "entity_type", "entity_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_audit_logs_tenant_entity",
        table_name="audit_logs",
    )

    op.drop_index(
        "ix_audit_logs_tenant_event_time",
        table_name="audit_logs",
    )

    op.drop_constraint(
        "fk_audit_logs_performed_by_users",
        "audit_logs",
        type_="foreignkey",
    )

    op.drop_constraint(
        "fk_audit_logs_tenant_id_tenants",
        "audit_logs",
        type_="foreignkey",
    )

    op.drop_index(
        "ix_audit_logs_tenant_id",
        table_name="audit_logs",
    )

    op.drop_column(
        "audit_logs",
        "tenant_id",
    )
