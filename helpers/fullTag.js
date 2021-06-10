

('pool', 'Swimming Pool'),
       ('tub', 'Hot Tub'),
       ('sauna', 'Sauna'),
       ('grill', 'BBQ/Grill'),
       ('yard', 'Yard'),
       ('firepit', 'Fire Pit'),
       ('gym', 'Gym/Workout'),
       ('trampoline', 'Trampoline'),
       ('garden', 'Garden'),
       ('studio', 'Music Studio'),
       ('patio', 'Patio');

const tagObj = {  "pool":"Swimming Pool",
                   "tub":'Hot Tub',
                   'sauna':'Sauna', 
                   'grill':'BBQ/Grill',
                    'firepit': 'Fire Pit',
                    'gym':'Gym/Workout', 
                    'trampoline':'Trampoline',
                    'yard':'Yard', 
                    'garden': 'Garden',
                    'studio': 'Music Studio',
                    'patio': 'Patio'}

function tagFullName(handle){
  return tagObj[handle]
}

module.exports = { tagFullName };