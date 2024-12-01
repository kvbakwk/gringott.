create table if not exists public.user (
    id serial primary key,
    name varchar(255) not null,
    email varchar(255) not null,
    password varchar(255) not null
);

create table if not exists public.user_device (
    user_id integer NOT NULL,
    device_id VARCHAR(100) NOT NULL,
    expire_date TIMESTAMP NOT NULL,
    foreign key (user_id) references public.user(id)
);

create table if not exists public.wallet (
    id serial primary key,
    user_id integer not null,
    name varchar(20),
    balance decimal(10, 2) not null,
    cash boolean not null,
    foreign key (user_id) references public.user(id)
);

create table if not exists public.super_category (
    id serial primary key,
    name varchar(255) not null,
    income boolean not null,
    outcome boolean not null
);

create table if not exists public.category (
    id serial primary key,
    name varchar(255) not null,
    super_category_id integer not null,
    foreign key (super_category_id) references public.super_category(id)
);

create table if not exists public.method (
    id serial primary key,
    name varchar(255) not null,
    cash boolean not null,
    bank boolean not null
);

create table if not exists public.transaction (
    id serial primary key,
    date timestamp not null,
    amount numeric(10, 2) not null,
    description varchar(255) not null,
    category_id integer not null,
    across_person varchar(255) not null,
    income boolean not null,
    important boolean not null,
    wallet_id integer not null,
    method_id integer not null,
    foreign key (wallet_id) references public.wallet(id),
    foreign key (category_id) references public.category(id),
    foreign key (method_id) references public.method(id)
);

create table if not exists public.future_transaction (
    id serial primary key,
    date timestamp,
    amount numeric(10, 2) not null,
    description varchar(255) not null,
    across_person varchar(255) not null,
    income boolean not null,
    important boolean not null,
    wallet_id integer not null,
    category_id integer not null,
    method_id integer not null,
    foreign key (wallet_id) references public.wallet(id),
    foreign key (category_id) references public.category(id),
    foreign key (method_id) references public.method(id)
);

create table if not exists public.product (
    id serial primary key,
    name varchar(255) not null,
    price integer not null
);

create table if not exists public.shop (
    id serial primary key,
    name varchar(255) not null,
    price integer not null
);


insert into public.user (name, email, password) values ('Jakub Kawka', 'kuba@gmail.com', 'zaq1@WSX');
insert into public.user (name, email, password) values ('Ola Kawka', 'ola@gmail.com', 'zaq1@WSX');
insert into public.user (name, email, password) values ('Iza Kawka', 'iza@gmail.com', 'zaq1@WSX');
insert into public.user (name, email, password) values ('Olaf Konieczny', 'olaf@gmail.com', 'zaq1@WSX');

insert into public.super_category (name, income, outcome) values ('osobiste', false, true);
insert into public.super_category (name, income, outcome) values ('codzienne', false, true);
insert into public.super_category (name, income, outcome) values ('domowe', false, true);
insert into public.super_category (name, income, outcome) values ('płatności', false, true);
insert into public.super_category (name, income, outcome) values ('rozrywka', false, true);
insert into public.super_category (name, income, outcome) values ('oszczędności', true, true);
insert into public.super_category (name, income, outcome) values ('dzieci', false, true);
insert into public.super_category (name, income, outcome) values ('transport', false, true);
insert into public.super_category (name, income, outcome) values ('wpływy', true, false);
insert into public.super_category (name, income, outcome) values ('inne', true, true);

insert into public.wallet (user_id, balance, cash) values (1, 10, true);
insert into public.wallet (user_id, name, balance, cash) values (1, 'mBank', 100, false);
insert into public.wallet (user_id, name, balance, cash) values (1, 'iPKO', 0, false);
insert into public.wallet (user_id, balance, cash) values (4, 3.14, true);
insert into public.wallet (user_id, name, balance, cash) values (4, 'mBank', 4, false);

insert into public.category (name, super_category_id) values ('rozwój', 1);
insert into public.category (name, super_category_id) values ('elektronika', 1);
insert into public.category (name, super_category_id) values ('multimedia', 1);
insert into public.category (name, super_category_id) values ('odzież i obuwie', 1);
insert into public.category (name, super_category_id) values ('prezenty i wsparcie', 1);
insert into public.category (name, super_category_id) values ('zdrowie i uroda', 1);
insert into public.category (name, super_category_id) values ('inne', 1);

insert into public.category (name, super_category_id) values ('jedzenie poza domem', 2);
insert into public.category (name, super_category_id) values ('zwierzęta', 2);
insert into public.category (name, super_category_id) values ('żywność i chemia domowa', 2);
insert into public.category (name, super_category_id) values ('inne', 2);

insert into public.category (name, super_category_id) values ('wyposażenie', 3);
insert into public.category (name, super_category_id) values ('remont', 3);
insert into public.category (name, super_category_id) values ('ubezpieczenie', 3);
insert into public.category (name, super_category_id) values ('usługi', 3);
insert into public.category (name, super_category_id) values ('inne', 3);

insert into public.category (name, super_category_id) values ('czynsz', 4);
insert into public.category (name, super_category_id) values ('woda i kanalizacja', 4);
insert into public.category (name, super_category_id) values ('gaz', 4);
insert into public.category (name, super_category_id) values ('prąd', 4);
insert into public.category (name, super_category_id) values ('ogrzewanie', 4);
insert into public.category (name, super_category_id) values ('telewizja', 4);
insert into public.category (name, super_category_id) values ('internet', 4);
insert into public.category (name, super_category_id) values ('telefon', 4);
insert into public.category (name, super_category_id) values ('opłaty', 4);
insert into public.category (name, super_category_id) values ('podatki', 4);
insert into public.category (name, super_category_id) values ('raty', 4);
insert into public.category (name, super_category_id) values ('ubezpieczenia', 4);
insert into public.category (name, super_category_id) values ('inne', 4);

insert into public.category (name, super_category_id) values ('podróż', 5);
insert into public.category (name, super_category_id) values ('wyjazd', 5);
insert into public.category (name, super_category_id) values ('sport', 5);
insert into public.category (name, super_category_id) values ('hobby', 5);
insert into public.category (name, super_category_id) values ('wyjście', 5);
insert into public.category (name, super_category_id) values ('wydarzenie', 5);
insert into public.category (name, super_category_id) values ('inne', 5);

insert into public.category (name, super_category_id) values ('fundusz', 6);
insert into public.category (name, super_category_id) values ('giełda', 6);
insert into public.category (name, super_category_id) values ('lokata', 6);
insert into public.category (name, super_category_id) values ('zakład', 6);
insert into public.category (name, super_category_id) values ('inne', 6);

insert into public.category (name, super_category_id) values ('zabawki', 7);
insert into public.category (name, super_category_id) values ('przedszkole', 7);
insert into public.category (name, super_category_id) values ('szkoła', 7);
insert into public.category (name, super_category_id) values ('zajęcia', 7);
insert into public.category (name, super_category_id) values ('inne', 7);

insert into public.category (name, super_category_id) values ('paliwo', 8);
insert into public.category (name, super_category_id) values ('parking', 8);
insert into public.category (name, super_category_id) values ('przejazd', 8);
insert into public.category (name, super_category_id) values ('serwis', 8);
insert into public.category (name, super_category_id) values ('sprzątanie', 8);
insert into public.category (name, super_category_id) values ('ubezpieczenie', 8);
insert into public.category (name, super_category_id) values ('inne', 8);

insert into public.category (name, super_category_id) values ('premia', 9);
insert into public.category (name, super_category_id) values ('wynagrodzenie', 9);
insert into public.category (name, super_category_id) values ('kredyt', 9);
insert into public.category (name, super_category_id) values ('kieszonkowe', 9);
insert into public.category (name, super_category_id) values ('inne', 9);

insert into public.method (name, cash, bank) values ('do ręki', true, false);
insert into public.method (name, cash, bank) values ('poczta', true, false);
insert into public.method (name, cash, bank) values ('przelew', false, true);
insert into public.method (name, cash, bank) values ('na telefon', false, true);
insert into public.method (name, cash, bank) values ('zbliżeniowo', false, true);
insert into public.method (name, cash, bank) values ('blik', false, true);

insert into public.transaction (date, amount, description, category_id, across_person, income, important, wallet_id, method_id) values ('2023-01-01 12:00:00', 10, 'kieszonkowe', 57, 'tata', true, true, 1, 1);
insert into public.transaction (date, amount, description, category_id, across_person, income, important, wallet_id, method_id) values ('2023-01-01 12:00:00', 100, 'kieszonkowe', 57, 'tata', true, true, 2, 2);