create table pilots (
	pilot_name varchar,
	phone_number varchar,
	email varchar,
	serial_number varchar not null unique,
	last_seen timestamptz not null,
	closest_distance double precision not null
);

create table drone_positions (
	id bigserial primary key,
	serial_number varchar not null references pilots (serial_number) on delete cascade,
	position_x double precision not null,
	position_y double precision not null,
	distance double precision not null,
	captured_at timestamptz not null
);

create index pilots_last_seen on pilots (last_seen);
