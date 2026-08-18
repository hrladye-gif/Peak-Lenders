"""add collection activities

Revision ID: e2f50986f168
Revises: f4c9a7b21d88
Create Date: 2026-08-18
"""

from alembic import op
import sqlalchemy as sa


revision = "e2f50986f168"
down_revision = "f4c9a7b21d88"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "collection_activities",

        sa.Column(
            "id",
            sa.String(),
            primary_key=True,
            nullable=False,
        ),

        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=True,
        ),

        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=True,
        ),

        sa.Column(
            "tenant_id",
            sa.String(),
            sa.ForeignKey("tenants.id"),
            nullable=False,
        ),

        sa.Column(
            "loan_id",
            sa.String(),
            sa.ForeignKey("loans.id"),
            nullable=False,
        ),

        sa.Column(
            "borrower_id",
            sa.String(),
            sa.ForeignKey("borrowers.id"),
            nullable=False,
        ),

        sa.Column(
            "officer_id",
            sa.String(),
            sa.ForeignKey("users.id"),
            nullable=True,
        ),

        sa.Column(
            "action",
            sa.String(),
            nullable=False,
        ),

        sa.Column(
            "outcome",
            sa.String(),
            nullable=True,
        ),

        sa.Column(
            "notes",
            sa.Text(),
            nullable=True,
        ),

        sa.Column(
            "next_visit",
            sa.Date(),
            nullable=True,
        ),

        sa.Column(
            "status",
            sa.String(),
            nullable=False,
            server_default="Pending",
        ),
    )


def downgrade() -> None:
    op.drop_table("collection_activities")
