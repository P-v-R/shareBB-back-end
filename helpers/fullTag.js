// instead of joining 3 tables to get the full tag name for each listings tags, 
// simple input tag handle and tagFullName will return its full name
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
  return tagObj[handle];
}





module.exports = { tagFullName };