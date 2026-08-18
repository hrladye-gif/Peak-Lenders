"""repair missing borrower group tables

Revision ID: f4c9a7b21d88
Revises: e1c6d91bccd7
Create Date: 2026-08-18
"""

from alembic import op
import sqlalchemy as sa


revision = "f4c9a7b21d88"
down_revision = "e1c6d91bccd7"
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    tables = inspector.get_table_names()

    if "groups" not in tables:
        op.create_table(
            "groups",

            sa.Column(
                "tenant_id",
                sa.String(),
                nullable=False,
            ),

            sa.Column(
                "branch_id",
                sa.String(),
                nullable=True,
            ),

            sa.Column(
                "name",
                sa.String(),
                nullable=False,
            ),

            sa.Column(
                "location",
                sa.String(),
                nullable=True,
            ),

            sa.Column(
                "status",
                sa.String(),
                nullable=False,
            ),

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

            sa.ForeignKeyConstraint(
                ["branch_id"],
                ["branches.id"],
            ),

            sa.PrimaryKeyConstraint("id"),
        )

    if "group_members" not in tables:
        op.create_table(
            "group_members",

            sa.Column(
                "group_id",
                sa.String(),
                nullable=False,
            ),

            sa.Column(
                "borrower_id",
                sa.String(),
                nullable=False,
            ),

            sa.Column(
                "role",
                sa.String(),
                nullable=False,
            ),

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
                ["group_id"],
                ["groups.id"],
            ),

            sa.ForeignKeyConstraint(
                ["borrower_id"],
                ["borrowers.id"],
            ),

            sa.PrimaryKeyConstraint("id"),
        )


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    tables = inspector.get_table_names()

    if "group_members" in tables:
        op.drop_table("group_members")

    if "groups" in tables:
        op.drop_table("groups")
