"""create missing loan transactions table

Revision ID: e1c6d91bccd7
Revises: 7148282c36d3
Create Date: 2026-08-18
"""

from alembic import op
import sqlalchemy as sa


revision = "e1c6d91bccd7"
down_revision = "7148282c36d3"
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if "loan_transactions" not in inspector.get_table_names():
        op.create_table(
            "loan_transactions",

            sa.Column(
                "loan_id",
                sa.String(),
                sa.ForeignKey("loans.id"),
                nullable=False,
            ),

            sa.Column(
                "transaction_type",
                sa.String(),
                nullable=False,
            ),

            sa.Column(
                "principal_amount",
                sa.Numeric(18, 2),
                nullable=True,
            ),

            sa.Column(
                "interest_amount",
                sa.Numeric(18, 2),
                nullable=True,
            ),

            sa.Column(
                "penalty_amount",
                sa.Numeric(18, 2),
                nullable=True,
            ),

            sa.Column(
                "total_amount",
                sa.Numeric(18, 2),
                nullable=False,
            ),

            sa.Column(
                "notes",
                sa.String(),
                nullable=True,
            ),

            sa.Column(
                "transaction_date",
                sa.DateTime(timezone=True),
                server_default=sa.text("now()"),
                nullable=True,
            ),

            sa.Column(
                "id",
                sa.String(),
                primary_key=True,
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
        )


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if "loan_transactions" in inspector.get_table_names():
        op.drop_table("loan_transactions")
