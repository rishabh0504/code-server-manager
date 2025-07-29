source ./.venv/Scripts/activate
uvicorn app.main:app --reload
prisma db push --force-reset && prisma generate
