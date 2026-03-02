# Patch: Make init_db optional on startup
import sys

# Read main.py
with open('app/main.py', 'r') as f:
    content = f.read()

# Replace the lifespan to skip DB init
content = content.replace(
    '''    try:
        await init_db()
        logger.info("app.lifecycle.started")
    except Exception as e:
        logger.error(f"app.lifecycle.failed error={e}", exc_info=True)
        raise''',
    '''    try:
        await init_db()
        logger.info("app.lifecycle.started")
    except Exception as e:
        logger.warning(f"app.lifecycle.db_init_failed error={e}, continuing anyway")
        logger.info("app.lifecycle.started (db unavailable)")'''
)

with open('app/main.py', 'w') as f:
    f.write(content)

print("Patched main.py to make DB init non-fatal")
