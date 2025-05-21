create table if not exists public.user (
    id serial primary key,
    name varchar(40) not null,
    email varchar(50) not null,
    password varchar(100) not null
);

create table if not exists public.user_device (
    user_id integer NOT NULL,
    device_id CHAR(36) NOT NULL,
    expire_date TIMESTAMP NOT NULL,
    foreign key (user_id) references public.user(id)
);

create table if not exists public.wallet_type (
    id serial primary key,
    name varchar(255) not null
);

create table if not exists public.wallet (
    id serial primary key,
    user_id integer not null,
    name varchar(10),
    balance decimal(10, 2) not null,
    wallet_type_id integer not null,
    foreign key (user_id) references public.user(id),
    foreign key (wallet_type_id) references public.wallet_type(id)
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


create table if not exists public.subject (
    id serial primary key,
    user_id integer not null,
    name varchar(128) not null,
    address varchar(128),
    normal boolean not null,
    atm boolean not null,
    foreign key (user_id) references public.user(id)
);

create table if not exists public.transaction_type (
    id serial primary key,
    name varchar(255) not null
);

create table if not exists public.transaction (
    id serial primary key,
    date timestamp not null,
    amount numeric(10, 2) not null,
    description varchar(255) not null,
    category_id integer not null,
    subject_id integer not null,
    income boolean not null,
    important boolean not null,
    user_id integer not null,
    wallet_id integer not null,
    method_id integer not null,
    transaction_type_id integer not null,
    foreign key (user_id) references public.user(id),
    foreign key (wallet_id) references public.wallet(id),
    foreign key (category_id) references public.category(id),
    foreign key (subject_id) references public.subject(id),
    foreign key (method_id) references public.method(id),
    foreign key (transaction_type_id) references public.transaction_type(id)
);

create table if not exists public.trade (
    id serial primary key,
    date timestamp not null,
    amount numeric(10, 2) not null,
    deposit boolean not null,
    atm boolean not null,
    user_id integer not null,
    wallet_id integer not null,
    subject_id integer not null,
    deposit_method_id integer not null,
    withdraw_method_id integer not null,
    foreign key (user_id) references public.user(id),
    foreign key (wallet_id) references public.wallet(id),
    foreign key (subject_id) references public.subject(id),
    foreign key (deposit_method_id) references public.method(id),
    foreign key (withdraw_method_id) references public.method(id)
);

create table if not exists public.product (
    id serial primary key,
    name varchar(255) not null,
    price integer not null
);


insert into public.user (name, email, password) values 
('Jakub Kawka', 'jakubkawka2005@gmail.com', 'zaq1@WSX'),
('Ola Kawka', 'ola@gmail.com', 'zaq1@WSX'),
('Iza Kawka', 'iza@gmail.com', 'zaq1@WSX'),
('Olaf Konieczny', 'olaf@gmail.com', 'zaq1@WSX');

insert into public.super_category (name, income, outcome) values 
('osobiste', false, true),
('codzienne', false, true),
('domowe', false, true),
('płatności', false, true),
('rozrywka', false, true),
('oszczędności', true, true),
('dzieci', false, true),
('transport', false, true),
('wpływy', true, false),
('inne', true, true);

insert into public.category (name, super_category_id) values 
('rozwój', 1), ('elektronika', 1), ('multimedia', 1), ('odzież i obuwie', 1), ('prezenty i wsparcie', 1), ('zdrowie i uroda', 1),
('jedzenie poza domem', 2), ('zwierzęta', 2), ('żywność', 2), ('chemia domowa', 2),
('wyposażenie', 3), ('remont', 3), ('ubezpieczenie', 3), ('usługi', 3),
('czynsz', 4), ('woda i kanalizacja', 4), ('gaz', 4), ('prąd', 4), ('ogrzewanie', 4), ('telewizja', 4), ('internet', 4), ('telefon', 4), ('opłaty', 4), ('podatki', 4), ('raty', 4), ('ubezpieczenia', 4),
('podróż', 5), ('wyjazd', 5), ('sport', 5), ('hobby', 5), ('wyjście', 5), ('wydarzenie', 5),
('fundusz', 6), ('giełda', 6), ('lokata', 6), ('zakład', 6), 
('zabawki', 7), ('przedszkole', 7), ('szkoła', 7), ('zajęcia', 7),
('paliwo', 8), ('parking', 8), ('przejazd', 8), ('serwis', 8), ('sprzątanie', 8), ('ubezpieczenie', 8),
('premia', 9), ('wynagrodzenie', 9), ('kredyt', 9), ('kieszonkowe', 9),
('automatyczne', 10);

insert into public.wallet_type (name) values 
('gotówka'), 
('bank'), 
('oszczędności'), 
('inwestycje');

insert into public.wallet (user_id, balance, wallet_type_id) values (1, 50, 1), (1, 0, 3), (1, 0, 4);
insert into public.wallet (user_id, name, balance, wallet_type_id) values (1, 'mBank', 60, 2), (1, 'iPKO', 0, 2);
insert into public.wallet (user_id, balance, wallet_type_id) values (4, 3.14, 1), (4, 0, 3), (4, 0, 4);
insert into public.wallet (user_id, name, balance, wallet_type_id) values (4, 'mBank', 4, 2);

insert into public.method (name, cash, bank) values 
('do ręki', true, false),
('poczta', true, false),
('przelew', false, true),
('na telefon', false, true),
('zbliżeniowo', false, true),
('blik', false, true),
('inne', true, true);

insert into public.transaction_type (name) values 
('normalna'),
('przyszła'),
('transfer'),
('bankomat'),
('wstępna');

insert into public.subject (user_id, name, normal, atm) values (1, 'Tata', true, false), (1, 'Mama', true, false), (1, 'Ola Kawka', true, false), (1, 'Bankomat', false, true);

insert into public.transaction (date, amount, description, category_id, subject_id, income, important, user_id, wallet_id, method_id, transaction_type_id) values 
('2025-04-01 12:00:00', 10, 'kieszonkowe', 50, 1, true, true, 1, 1, 1, 1),
('2025-04-01 12:00:00', 100, 'kieszonkowe', 50, 1, true, true, 1, 4, 4, 1);

insert into public.trade (date, amount, deposit, atm, user_id, wallet_id, subject_id, deposit_method_id, withdraw_method_id) values 
('2025-04-02 12:00:00', 40, false, false, 1, 4, 4, 1, 3);
