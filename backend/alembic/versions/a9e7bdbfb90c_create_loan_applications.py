"""create loan applications

Revision ID: a9e7bdbfb90c
Revises: ea03a326b887
Create Date: 2026-08-13
"""

from alembic import op
import sqlalchemy as sa


revision = "a9e7bdbfb90c"
down_revision = "ea03a326b887"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "loan_applications",

        sa.Column(
            "id",
            sa.String(),
            primary_key=True,
        ),

        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),

        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),

        sa.Column(
            "tenant_id",
            sa.String(),
            sa.ForeignKey("tenants.id"),
            nullable=False,
        ),

        sa.Column(
            "branch_id",
            sa.String(),
            sa.ForeignKey("branches.id"),
            nullable=True,
        ),

        sa.Column(
            "borrower_id",
            sa.String(),
            sa.ForeignKey("borrowers.id"),
            nullable=False,
        ),

        sa.Column(
            "loan_product_id",
            sa.String(),
            sa.ForeignKey("loan_products.id"),
            nullable=True,
        ),

        sa.Column(
            "application_number",
            sa.String(),
            nullable=False,
            unique=True,
        ),

        sa.Column(
            "amount",
            sa.Numeric(18, 2),
            nullable=False,
        ),

        sa.Column(
            "term_months",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "purpose",
            sa.String(),
            nullable=True,
        ),

        sa.Column(
            "status",
            sa.String(),
            nullable=False,
            server_default="PENDING",
        ),

        sa.Column(
            "submitted_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),

        sa.Column(
            "reviewed_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),

        sa.Column(
            "reviewed_by",
            sa.String(),
            sa.ForeignKey("users.id"),
            nullable=True,
        ),
    )


def downgrade():
    op.drop_table("loan_applications")
