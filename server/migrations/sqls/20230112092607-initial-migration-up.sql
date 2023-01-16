create table violators (
	pilot_name varchar,
	phone_number varchar,
	email varchar,
	serial_number varchar not null unique,
	last_seen timestamptz not null,
	closest_distance double precision not null,
	last_seen_position_x double precision not null,
	last_seen_position_y double precision not null
);

create table drone_positions (
	id bigserial primary key,
	serial_number varchar not null references violators (serial_number) on delete cascade,
	position_x double precision not null,
	position_y double precision not null,
	distance double precision not null,
	captured_at timestamptz not null
);

create index violators_last_seen on violators (last_seen);
