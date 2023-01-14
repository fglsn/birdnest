create table pilots (
	pilot_name varchar not null,
	phone_number varchar not null,
	email varchar not null,
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

create index pilots_serial_number on pilots (serial_number);
