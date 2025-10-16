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
    user_method_id integer not null,
    subject_id integer not null,
    subject_method_id integer not null,
    foreign key (user_id) references public.user(id),
    foreign key (wallet_id) references public.wallet(id),
    foreign key (user_method_id) references public.method(id),
    foreign key (subject_id) references public.subject(id),
    foreign key (subject_method_id) references public.method(id)
);

create table if not exists public.transfer (
    id serial primary key,
    user_id integer not null,
    date timestamp not null,
    amount numeric(10, 2) not null,
    method_id integer not null,
    from_wallet_id integer not null,
    to_wallet_id integer not null,
    foreign key (user_id) references public.user(id),
    foreign key (method_id) references public.method(id),
    foreign key (from_wallet_id) references public.wallet(id),
    foreign key (to_wallet_id) references public.wallet(id)
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
('codzienne', false, true),
('transport', false, true),
('osobiste', false, true),
('domowe', false, true),
('dzieci', false, true),
('rozrywka', false, true),
('płatności', false, true),
('oszczędności', true, true),
('inwestycje', true, true),
('wpływy', true, false);

insert into public.category (name, super_category_id) values 
('jedzenie poza domem', 1), ('zwierzęta', 1), ('żywność', 1), ('chemia domowa', 1),
('paliwo', 2), ('parking', 2), ('przejazd', 2), ('serwis', 2), ('sprzątanie', 2), ('ubezpieczenie', 2),
('rozwój', 3), ('elektronika', 3), ('multimedia', 3), ('odzież i obuwie', 3), ('prezenty i wsparcie', 3), ('zdrowie i uroda', 3),
('czynsz', 4), ('woda i kanalizacja', 4), ('gaz', 4), ('prąd', 4), ('ogrzewanie', 4), ('telewizja', 4), ('internet', 4), ('telefon', 4), ('opłaty', 4), ('podatki', 4), ('raty', 4), ('ubezpieczenia', 4),
('zabawki', 5), ('przedszkole', 5), ('szkoła', 5), ('zajęcia', 5),
('podróż', 6), ('wyjazd', 6), ('sport', 6), ('hobby', 6), ('wyjście', 6), ('wydarzenie', 6),
('wyposażenie', 7), ('remont', 7), ('ubezpieczenie', 7), ('usługi', 7),
('ogólne', 8), ('skarbonki', 8), ('cele', 8),
('akcje', 9), ('etf', 9), ('fundusz', 9), ('lokata', 9), ('zakład', 9), ('waluta', 9), ('kryptowaluta', 9), ('surowce', 9),
('wynagrodzenie', 10), ('premia', 10), ('pożyczenie', 10), ('kredyt', 10), ('kieszonkowe', 10), ('wstępne', 10);

insert into public.wallet_type (name) values 
('gotówka'), 
('bank'), 
('należności'), 
('oszczędności'), 
('skarbonka'),
('cel'), 
('akcje'), 
('etf'), 
('fundusz'), 
('lokata'), 
('zakład'), 
('waluta'), 
('kryptowaluta'), 
('surowiec');

insert into public.wallet (user_id, balance, wallet_type_id) values (1, 40, 1), (1, 0, 3);
insert into public.wallet (user_id, name, balance, wallet_type_id) values (1, 'mBank', 70, 2), (1, 'iPKO', 0, 2);
insert into public.wallet (user_id, balance, wallet_type_id) values (4, 3.14, 1), (4, 0, 3);
insert into public.wallet (user_id, name, balance, wallet_type_id) values (4, 'mBank', 4, 2);

insert into public.method (name, cash, bank) values 
('do ręki', true, false),
('pocztą', true, false),
('przelew tradycyjny', false, true),
('przelew na telefon', false, true),
('kartą', false, true),
('zbliżeniowo', false, true),
('blikiem', false, true),
('-', false, false);

insert into public.transaction_type (name) values 
('normalna'),
('przyszła'),
('transfer'),
('bankomat'),
('wstępna');

insert into public.subject (user_id, name, normal, atm) values (1, 'Tata', true, false), (1, 'Mama', true, false), (1, 'Ola Kawka', true, false), (1, 'Bankomat', false, true), (1, 'Ty', true, false);

insert into public.transaction (date, amount, description, category_id, subject_id, income, important, user_id, wallet_id, method_id, transaction_type_id) values 
('2025-04-01 12:00:00', 10, 'kieszonkowe', 58, 1, true, true, 1, 1, 1, 1),
('2025-04-01 12:00:00', 100, 'kieszonkowe', 58, 1, true, true, 1, 3, 4, 1);

insert into public.trade (date, amount, deposit, atm, user_id, wallet_id, user_method_id, subject_id, subject_method_id) values 
('2025-04-02 12:00:00', 40, false, true, 1, 3, 1, 4, 3),
('2025-04-02 13:00:00', 10, true, false, 1, 3, 1, 3, 4);
