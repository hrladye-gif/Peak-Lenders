from app.db.database import engine, Base

# Load every SQLAlchemy model before create_all()
import app.models

Base.metadata.create_all(bind=engine)

print("Database initialized successfully")
