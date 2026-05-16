create table if not exists menus (
  id text primary key,
  name varchar(120) not null,
  description text not null,
  price integer not null check (price >= 0),
  image_url text not null,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists options (
  id text primary key,
  menu_id text not null references menus(id) on delete cascade,
  name varchar(120) not null,
  price integer not null check (price >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,
  ordered_at timestamptz not null default now(),
  status varchar(32) not null check (status in ('ACCEPTED', 'IN_PROGRESS', 'COMPLETED')),
  total_amount integer not null check (total_amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id text primary key,
  order_id text not null references orders(id) on delete cascade,
  menu_id text not null references menus(id),
  menu_name varchar(120) not null,
  quantity integer not null check (quantity > 0),
  unit_price integer not null check (unit_price >= 0),
  line_amount integer not null check (line_amount >= 0)
);

create table if not exists order_item_options (
  id text primary key,
  order_item_id text not null references order_items(id) on delete cascade,
  option_id text not null references options(id),
  option_name varchar(120) not null,
  option_price integer not null check (option_price >= 0)
);

create index if not exists idx_options_menu_id on options(menu_id);
create index if not exists idx_order_items_order_id on order_items(order_id);
create index if not exists idx_order_item_options_order_item_id on order_item_options(order_item_id);
create index if not exists idx_orders_ordered_at on orders(ordered_at desc);
