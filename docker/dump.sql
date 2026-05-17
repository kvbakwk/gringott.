-- Function to automatically update updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create Tables
create table if not exists public.users (
    id serial primary key,
    name varchar(255) not null,
    email varchar(255) not null unique,
    password varchar(255) not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null,
    deleted_at timestamp
);

create table if not exists public.wallets (
    id serial primary key,
    user_id integer not null,
    name varchar(50),
    balance numeric(15, 2) not null,
    icon varchar(255),
    wallet_type_id integer not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null,
    deleted_at timestamp
);

create table if not exists public.wallet_types (
    id serial primary key,
    name varchar(255) not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null,
    deleted_at timestamp
);

create table if not exists public.wallet_bank_details (
    wallet_id integer primary key,
    bank_name varchar(255),
    account_number varchar(255),
    bic_swift varchar(50),
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null,
    deleted_at timestamp
);

create table if not exists public.wallet_goal_details (
    wallet_id integer primary key,
    target_amount numeric(15, 2) not null,
    status varchar(50) default 'active' not null,
    deadline timestamp,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null,
    deleted_at timestamp
);

create table if not exists public.transactions (
    id serial primary key,
    date timestamp not null,
    amount numeric(15, 2) not null,
    description varchar(255) not null,
    category_id integer not null,
    subject_id integer not null,
    income boolean not null,
    important boolean not null,
    user_id integer not null,
    wallet_id integer not null,
    method_id integer not null,
    loan_id integer,
    transaction_type_id integer not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null,
    deleted_at timestamp
);

create table if not exists public.transaction_types (
    id serial primary key,
    name varchar(255) not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null,
    deleted_at timestamp
);

create table if not exists public.trades (
    id serial primary key,
    date timestamp not null,
    amount numeric(15, 2) not null,
    deposit boolean not null,
    user_id integer not null,
    wallet_id integer not null,
    user_method_id integer not null,
    subject_id integer not null,
    subject_method_id integer not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null,
    deleted_at timestamp
);

create table if not exists public.transfers (
    id serial primary key,
    date timestamp not null,
    amount numeric(15, 2) not null,
    user_id integer not null,
    method_id integer not null,
    from_wallet_id integer not null,
    to_wallet_id integer not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null,
    deleted_at timestamp
);

create table if not exists public.assets (
    id serial primary key,
    wallet_id integer not null,
    name varchar(255) not null,
    ticker varchar(50),
    asset_type_id integer not null,
    quantity numeric(15, 4) not null,
    currency varchar(10) not null,
    avg_buy_price numeric(15, 2),
    current_price numeric(15, 2),
    icon varchar(255),
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null,
    deleted_at timestamp
);

create table if not exists public.asset_types (
    id serial primary key,
    name varchar(255) not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null,
    deleted_at timestamp
);

create table if not exists public.categories (
    id serial primary key,
    name varchar(255) not null,
    income boolean not null,
    outcome boolean not null,
    category_type_id integer not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null,
    deleted_at timestamp
);

create table if not exists public.category_types (
    id serial primary key,
    name varchar(255) not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null,
    deleted_at timestamp
);

create table if not exists public.methods (
    id serial primary key,
    name varchar(255) not null,
    cash boolean not null,
    bank boolean not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null,
    deleted_at timestamp
);

create table if not exists public.subjects (
    id serial primary key,
    user_id integer not null,
    name varchar(255) not null,
    address varchar(255),
    subject_type_id integer not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null,
    deleted_at timestamp
);

create table if not exists public.subject_types (
    id serial primary key,
    name varchar(255) not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null,
    deleted_at timestamp
);

create table if not exists public.loans (
    id serial primary key,
    user_id integer not null,
    subject_id integer not null,
    name varchar(255),
    total_amount numeric(15, 2) not null,
    paid_amount numeric(15, 2) default 0 not null,
    is_given boolean not null,
    currency varchar(10) default 'PLN' not null,
    status varchar(50) default 'active' not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null,
    deleted_at timestamp
);

create table if not exists public.products (
    id serial primary key,
    name varchar(255) not null,
    price numeric(15, 2) not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null,
    deleted_at timestamp
);

-- Triggers for updated_at
create trigger update_users_updated_at before update on public.users for each row execute procedure update_updated_at_column();
create trigger update_wallet_types_updated_at before update on public.wallet_types for each row execute procedure update_updated_at_column();
create trigger update_asset_types_updated_at before update on public.asset_types for each row execute procedure update_updated_at_column();
create trigger update_wallets_updated_at before update on public.wallets for each row execute procedure update_updated_at_column();
create trigger update_category_types_updated_at before update on public.category_types for each row execute procedure update_updated_at_column();
create trigger update_categories_updated_at before update on public.categories for each row execute procedure update_updated_at_column();
create trigger update_methods_updated_at before update on public.methods for each row execute procedure update_updated_at_column();
create trigger update_subjects_updated_at before update on public.subjects for each row execute procedure update_updated_at_column();
create trigger update_loans_updated_at before update on public.loans for each row execute procedure update_updated_at_column();
create trigger update_transaction_types_updated_at before update on public.transaction_types for each row execute procedure update_updated_at_column();
create trigger update_transactions_updated_at before update on public.transactions for each row execute procedure update_updated_at_column();
create trigger update_trades_updated_at before update on public.trades for each row execute procedure update_updated_at_column();
create trigger update_transfers_updated_at before update on public.transfers for each row execute procedure update_updated_at_column();
create trigger update_products_updated_at before update on public.products for each row execute procedure update_updated_at_column();
create trigger update_assets_updated_at before update on public.assets for each row execute procedure update_updated_at_column();
create trigger update_bank_details_updated_at before update on public.wallet_bank_details for each row execute procedure update_updated_at_column();
create trigger update_goal_details_updated_at before update on public.wallet_goal_details for each row execute procedure update_updated_at_column();

-- Foreign Key Constraints
alter table public.wallets add foreign key (user_id) references public.users(id);
alter table public.wallets add foreign key (wallet_type_id) references public.wallet_types(id);

alter table public.categories add foreign key (category_type_id) references public.category_types(id);

alter table public.subjects add foreign key (user_id) references public.users(id);

alter table public.loans add foreign key (user_id) references public.users(id);
alter table public.loans add foreign key (subject_id) references public.subjects(id);

alter table public.transactions add foreign key (user_id) references public.users(id);
alter table public.transactions add foreign key (wallet_id) references public.wallets(id);
alter table public.transactions add foreign key (category_id) references public.categories(id);
alter table public.transactions add foreign key (subject_id) references public.subjects(id);
alter table public.transactions add foreign key (method_id) references public.methods(id);
alter table public.transactions add foreign key (transaction_type_id) references public.transaction_types(id);
alter table public.transactions add foreign key (loan_id) references public.loans(id);

alter table public.trades add foreign key (user_id) references public.users(id);
alter table public.trades add foreign key (wallet_id) references public.wallets(id);
alter table public.trades add foreign key (user_method_id) references public.methods(id);
alter table public.trades add foreign key (subject_id) references public.subjects(id);
alter table public.trades add foreign key (subject_method_id) references public.methods(id);

alter table public.transfers add foreign key (user_id) references public.users(id);
alter table public.transfers add foreign key (method_id) references public.methods(id);
alter table public.transfers add foreign key (from_wallet_id) references public.wallets(id);
alter table public.transfers add foreign key (to_wallet_id) references public.wallets(id);

alter table public.assets add foreign key (wallet_id) references public.wallets(id);
alter table public.assets add foreign key (asset_type_id) references public.asset_types(id);
alter table public.wallet_bank_details add foreign key (wallet_id) references public.wallets(id);
alter table public.wallet_goal_details add foreign key (wallet_id) references public.wallets(id);

-- Indexes for Foreign Keys
create index idx_wallets_user_id on public.wallets(user_id);
create index idx_wallets_wallet_type_id on public.wallets(wallet_type_id);
create index idx_categories_category_type_id on public.categories(category_type_id);
create index idx_subjects_user_id on public.subjects(user_id);
create index idx_loans_user_id on public.loans(user_id);
create index idx_loans_subject_id on public.loans(subject_id);
create index idx_transactions_user_id on public.transactions(user_id);
create index idx_transactions_wallet_id on public.transactions(wallet_id);
create index idx_transactions_category_id on public.transactions(category_id);
create index idx_transactions_subject_id on public.transactions(subject_id);
create index idx_transactions_method_id on public.transactions(method_id);
create index idx_transactions_transaction_type_id on public.transactions(transaction_type_id);
create index idx_transactions_loan_id on public.transactions(loan_id);
create index idx_trades_user_id on public.trades(user_id);
create index idx_trades_wallet_id on public.trades(wallet_id);
create index idx_trades_user_method_id on public.trades(user_method_id);
create index idx_trades_subject_id on public.trades(subject_id);
create index idx_trades_subject_method_id on public.trades(subject_method_id);
create index idx_transfers_user_id on public.transfers(user_id);
create index idx_transfers_method_id on public.transfers(method_id);
create index idx_transfers_from_wallet_id on public.transfers(from_wallet_id);
create index idx_transfers_to_wallet_id on public.transfers(to_wallet_id);
create index idx_assets_wallet_id on public.assets(wallet_id);

-- Initial Data
insert into public.users (name, email, password) values 
('Jakub Kawka', 'jakubkawka2005@gmail.com', '$2b$10$KV/dnPMobmqZBvje.QYGf.9qqEks5wp1bceSIDhbyKolrByUWX0VG'),
('Ola Kawka', 'ola@gmail.com', '$2b$10$KV/dnPMobmqZBvje.QYGf.9qqEks5wp1bceSIDhbyKolrByUWX0VG'),
('Iza Kawka', 'iza@gmail.com', '$2b$10$KV/dnPMobmqZBvje.QYGf.9qqEks5wp1bceSIDhbyKolrByUWX0VG'),
('Olaf Konieczny', 'olaf@gmail.com', '$2b$10$KV/dnPMobmqZBvje.QYGf.9qqEks5wp1bceSIDhbyKolrByUWX0VG');

insert into public.category_types (name) values 
('codzienne'),
('transport'),
('osobiste'),
('domowe'),
('dzieci'),
('rozrywka'),
('płatności'),
('oszczędności'),
('inwestycje'),
('wpływy');

insert into public.categories (name, income, outcome, category_type_id) values 
('jedzenie poza domem', false, true, 1), ('zwierzęta', false, true, 1), ('żywność', false, true, 1), ('chemia domowa', false, true, 1),
('paliwo', false, true, 2), ('parking', false, true, 2), ('przejazd', false, true, 2), ('serwis', false, true, 2), ('sprzątanie', false, true, 2), ('ubezpieczenie', false, true, 2),
('rozwój', false, true, 3), ('elektronika', false, true, 3), ('multimedia', false, true, 3), ('odzież i obuwie', false, true, 3), ('prezenty i wsparcie', false, true, 3), ('zdrowie i uroda', false, true, 3),
('czynsz', false, true, 4), ('woda i kanalizacja', false, true, 4), ('gaz', false, true, 4), ('prąd', false, true, 4), ('ogrzewanie', false, true, 4), ('telewizja', false, true, 4), ('internet', false, true, 4), ('telefon', false, true, 4), ('opłaty', false, true, 4), ('podatki', false, true, 4), ('raty', false, true, 4), ('ubezpieczenia', false, true, 4),
('zabawki', false, true, 5), ('przedszkole', false, true, 5), ('szkoła', false, true, 5), ('zajęcia', false, true, 5),
('podróż', false, true, 6), ('wyjazd', false, true, 6), ('sport', false, true, 6), ('hobby', false, true, 6), ('wyjście', false, true, 6), ('wydarzenie', false, true, 6),
('wyposażenie', false, true, 7), ('remont', false, true, 7), ('ubezpieczenie', false, true, 7), ('usługi', false, true, 7),
('ogólne', true, true, 8), ('skarbonki', true, true, 8), ('cele', true, true, 8),
('akcje', true, true, 9), ('etf', true, true, 9), ('fundusz', true, true, 9), ('lokata', true, true, 9), ('zakład', true, true, 9), ('waluta', true, true, 9), ('kryptowaluta', true, true, 9), ('surowce', true, true, 9),
('wynagrodzenie', true, false, 10), ('premia', true, false, 10), ('pożyczenie', true, false, 10), ('kredyt', true, false, 10), ('kieszonkowe', true, false, 10), ('wstępne', true, false, 10);

insert into public.wallet_types (name) values 
('gotówka'), 
('konto'), 
('oszczędności'), 
('skarbonka'),
('cel'), 
('inwestycje');

insert into public.asset_types (name) values 
('akcje'), 
('etf'), 
('fundusz'), 
('lokata'), 
('zakład'), 
('waluta'), 
('kryptowaluta'), 
('surowiec');

insert into public.wallets (user_id, balance, wallet_type_id) values (1, 40, 1);
insert into public.wallets (user_id, name, balance, wallet_type_id) values (1, 'mBank', 70, 2), (1, 'iPKO', 0, 2);
insert into public.wallets (user_id, balance, wallet_type_id) values (4, 3.14, 1);
insert into public.wallets (user_id, name, balance, wallet_type_id) values (4, 'mBank', 4, 2);

insert into public.methods (name, cash, bank) values 
('do ręki', true, false),
('pocztą', true, false),
('przelew tradycyjny', false, true),
('przelew na telefon', false, true),
('kartą', false, true),
('zbliżeniowo', false, true),
('blikiem', false, true),
('-', false, false);

insert into public.transaction_types (name) values 
('normalna'),
('przyszła'),
('wstępna');

insert into public.subject_types (name) values 
('osoba'),
('bankomat');

insert into public.subjects (user_id, name, subject_type_id) values 
(1, 'Tata', 1), (1, 'Mama', 1), (1, 'Ola Kawka', 1), (1, 'Bankomat', 2), (1, 'Ty', 1);

insert into public.transactions (date, amount, description, category_id, subject_id, income, important, user_id, wallet_id, method_id, transaction_type_id) values 
('2025-04-01 12:00:00', 10, 'kieszonkowe', 58, 1, true, true, 1, 1, 1, 1),
('2025-04-01 12:00:00', 100, 'kieszonkowe', 58, 1, true, true, 1, 3, 4, 1),
('2025-04-01 12:00:00', 100, 'wypłata', 58, 1, true, true, 1, 1, 1, 1);

insert into public.trades (date, amount, deposit, user_id, wallet_id, user_method_id, subject_id, subject_method_id) values 
('2025-04-02 12:00:00', 40, false, 1, 3, 1, 4, 3),
('2025-04-02 13:00:00', 10, true, 1, 3, 1, 3, 4);

insert into public.transfers (date, amount, user_id, method_id, from_wallet_id, to_wallet_id) values 
('2025-04-03 12:00:00', 100, 1, 1, 1, 2);