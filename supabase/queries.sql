-- ==========================
-- Exemples de requêtes SQL
-- ==========================

-- 1) Dernières annonces
select l.id, l.title, l.description, l.price, l.category, l.image_url, l.created_at, p.display_name as seller_name
from public.listings l
join public.profiles p on p.id = l.seller_id
order by l.created_at desc
limit 20;

-- 2) Recherche annonces (titre + catégorie + prix)
-- Remplacez les paramètres dans votre client (q, min_price, max_price)
select l.*
from public.listings l
where (lower(l.title) like lower('%pack%') or lower(l.category) like lower('%pack%'))
  and l.price between 0 and 100
order by l.created_at desc;

-- 3) Messages d'un utilisateur (envoyés + reçus)
-- Remplacez USER_UUID par l'id auth.uid()
select m.id, m.content, m.created_at, m.sender_id, m.receiver_id, l.title as listing_title
from public.messages m
join public.listings l on l.id = m.listing_id
where m.sender_id = 'USER_UUID'::uuid
   or m.receiver_id = 'USER_UUID'::uuid
order by m.created_at desc;

-- 4) Créer une annonce (exemple SQL brut)
insert into public.listings (seller_id, title, description, price, category, image_url)
values ('USER_UUID'::uuid, 'Titre annonce', 'Description', 49.90, 'Packs', 'https://example.com/image.jpg');

-- 5) Envoyer un message
insert into public.messages (listing_id, sender_id, receiver_id, content)
values (1, 'SENDER_UUID'::uuid, 'RECEIVER_UUID'::uuid, 'Bonjour, annonce disponible ?');
