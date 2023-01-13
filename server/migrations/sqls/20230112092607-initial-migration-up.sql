create table violator_entries (
	id bigserial primary key,
	pilot_name varchar not null,
	phone_number varchar not null,
	email varchar not null,
	serial_number varchar not null unique,
	position_x double precision not null,
	position_y double precision not null,
	distance double precision not null,
	last_seen timestamptz not null
)
