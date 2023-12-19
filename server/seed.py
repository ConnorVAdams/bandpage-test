#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from datetime import datetime, timedelta
from random import choice, randint

# Remote library imports
from faker import Faker

# Local imports
from app import app
from app_setup import db
from models.artist import Artist
from models.fan import Fan
from models.like import Like
from models.track import Track
from models.event import Event
from models.user import User

# *******************
# * FAKER FUNCTIONS *
# *******************

fake = Faker()

username_set = set()

while len(username_set) < 100:
    username = fake.user_name()
    username_set.add(username)

unique_usernames = list(username_set)

# *****************************
# * RANDOM DATETIME FUNCTIONS *
# *****************************

def round_to_nearest_half_hour(dt):
    new_minute = 0 if dt.minute < 15 else 30
    rounded_dt = dt.replace(second=0, microsecond=0, minute=new_minute)
    return rounded_dt

def rand_date():
    current_time = datetime.now()
    one_year_ago = current_time - timedelta(days=365)
    one_year_later = current_time + timedelta(days=365)
    dt = current_time + timedelta(days=randint(-365, 365))
    random_hour = randint(0, 23) 
    dt = dt.replace(hour=random_hour, minute=randint(0, 1) * 30)
    return round_to_nearest_half_hour(dt)

# ********************************
# * SEED DATA CREATION FUNCTIONS *
# ********************************

def create_artists():
    artists = []

    for i in range(10):

        artist = Artist(
            name=fake.word().title(),
            genres=choice(['Rock', 'Pop', 'Hip-Hop', 'Jazz', 'Electronic', 'Country', 'R&B', 'Classical']),
            bio=fake.text(max_nb_chars=200),
            location=fake.city(),
            img='https://picsum.photos/id/334/200',
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

        artists.append(artist)

    return artists

def create_fans():
    fans = []

    for i in range(50):

        fan = Fan(
            name=fake.name().title(),
            bio=fake.text(max_nb_chars=200),
            location=fake.city(),
            img='https://picsum.photos/id/342/200',
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        fans.append(fan)

    return fans

def create_users(artists, fans):
    
    for artist in artists:
        username = unique_usernames.pop(randint(0, (len(unique_usernames) - 1)))

        user = User(
            username = username
            )
        
        user.password_hash = fake.word()        
        db.session.add(user)
        db.session.commit()

        artist.user_id = user.id

    db.session.add_all(artists)

    for fan in fans:
        username = unique_usernames.pop(randint(0, (len(unique_usernames) - 1)))

        user = User(
            username = username
            )
        
        user.password_hash = 'password'
        db.session.add(user)
        db.session.commit()

        fan.user_id = user.id
    
    db.session.add_all(fans)

def create_events():
    events = []

    all_artist_ids = [artist.id for artist in Artist.query.all()]

    for i in range(60):
        venues = ['Melissa\'s', 'Jake\'s', 'Calypso', 'Circe', 'Agamemnon', 'Ajax', 'Red\'s Bar']
        event = Event(
            date_time = rand_date(),
            venue = choice(venues),
            artist_id = choice(all_artist_ids)
        )
        events.append(event)
    
    return events

def create_tracks():
    all_artist_ids = [artist.id for artist in Artist.query.all()]
    url = 'https://audio-hosting-service.com/audio1.mp3'

    tracks = []
    
    for i in range(60):
        track = Track(
            name=fake.text(max_nb_chars=20),
            audio=url,
            artist_id = choice(all_artist_ids)
        )
        tracks.append(track)
    
    return tracks

def create_likes():
    # Fetch all fan IDs from the database
    all_fan_ids = {fan.id for fan in Fan.query.all()}
    all_artist_ids = {artist.id for artist in Artist.query.all()}
    all_event_ids = {event.id for event in Event.query.all()}
    all_track_ids = {track.id for track in Track.query.all()}

    # Create placeholder relationships
    likes = set()
    while len(likes) < 150:  # Adjust the number of placeholder likes as needed
        likeable_type = choice(['artist', 'event', 'track'])
        liker_type = choice(['artist', 'fan'])
        artist_id = None
        fan_id = None
        if liker_type == 'artist':
            artist_id = choice(list(all_artist_ids))
        else:  # if liker_type == 'fan'
            fan_id = choice(list(all_fan_ids))

        if likeable_type == 'artist':
            likeable_id = choice(list(all_artist_ids))
        elif likeable_type == 'event':
            likeable_id = choice(list(all_event_ids))
        else:  # likeable_type == 'track'
            likeable_id = choice(list(all_track_ids))

        like_tuple = (likeable_type, likeable_id, liker_type, artist_id, fan_id)

        if like_tuple not in likes:
            like = Like(
                likeable_type=likeable_type,
                likeable_id=likeable_id,
                liker_type=liker_type,
                artist_id=artist_id,
                fan_id=fan_id,
            )
            likes.add(like)
    return likes

if __name__ == '__main__':
    with app.app_context():
        print('Clearing db...')
        User.query.delete()
        Artist.query.delete()
        Fan.query.delete()
        Event.query.delete()
        Track.query.delete()
        Like.query.delete()

        print("Starting seed...")
        artists = create_artists()
        fans = create_fans()
        create_users(artists, fans)

        events = create_events()
        db.session.add_all(events)

        tracks = create_tracks()
        db.session.add_all(tracks)

        # likes = create_likes()
        # db.session.add_all(likes)

        db.session.commit()
        
