dev:
	@echo "Starting development environment..."
	yarn start:db
	yarn generate
	yarn migrate
	yarn start:dev

reset-db:
	@echo "Resetting database..."
	yarn reset:db

seed:
	@echo "Seeding database..."
	yarn seed:db

stop:
	@echo "Stopping docker..."
	yarn stop:db
