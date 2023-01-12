create table violating_entries (
	id bigserial primary key,
	pilot_name varchar not null,
	email varchar not null,
	phone_number varchar not null,
	lat double precision not null,
	lng double precision not null,
	min_distance double precision not null,
	captured_at timestamptz not null default now(),
	expires_at timestamptz not null default now() + time '00:10'
)