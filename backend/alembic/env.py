from logging.config import fileConfig
import app.models.user
from sqlalchemy import engine_from_config
from sqlalchemy import pool
import app.models.borrower
from alembic import context
import app.models.loan_product
import app.models.loan
import app.models.loan_schedule
from app.core.config import settings
from app.db.database import Base
import app.models.repayment
import app.models.loan_transaction
import app.models.tenant
import app.models.branch
import app.models.account
import app.models.journal_entry
import app.models.journal_line
import app.models.guarantor
import app.models.collateral
import app.models.savings_product
import app.models.savings_account
import app.models.savings_transaction
import app.models.audit_log
config = context.config

config.set_main_option(
    "sqlalchemy.url",
    settings.DATABASE_URL.replace("%", "%%")
)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline():
    context.configure(
        url=settings.DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        compare_type=True
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
