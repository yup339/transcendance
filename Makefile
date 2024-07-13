ifneq (,$(wildcard ./.env))
    include .env
    export
endif

all : up

up : 
	@ docker-compose up --build

down: 
	@docker-compose down

start: 
	@docker-compose start

stop: 
	@docker-compose  stop

ps:
	@docker ps 

psa:
	@docker ps -a

restart: down up

go_nx: 
	docker-compose exec nginx /bin/sh

go_django: 
	docker-compose exec django /bin/sh

psql :
	@docker exec -it postgresql psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

pbash :
	@docker exec -it postgresql /bin/bash

clean:
	@docker-compose down -v

run: clean up

fclean: down
	@docker-compose down --rmi all -v
	@docker volume prune -f
	@docker system prune -f
	@docker volume ls -q | xargs docker volume rm

cleanjs:
	@docker-compose down
	@docker volume rm transcendance_static

cleandb:
	@docker-compose down
	@docker volume rm transcendance_db_data

rejs: cleanjs up

redb: cleandb up

wre: cleanjs cleandb up

.PHONY: up down start stop ps psa restart clean psql pbash cleanjs cleandb rejs redb wre go_nx go_django
