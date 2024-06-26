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


clean: down
	@docker-compose down --rmi all -v
	@docker volume prune -f
	@docker system prune -f
	@docker volume ls -q | xargs docker volume rm

.PHONY: up down start stop ps psa restart clean 