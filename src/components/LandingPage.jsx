import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className='bio-item'>
      <Link to='/'>Paint with Pals!</Link>
      <p className='about-description'>
        {' '}
        PaintPals allows you to chose a color and paint with others in realtime!
        You are able to save the current drawing to your device or clear the
        board for new drawing! The frontend is made with react and socket.io
        paired with supabase to create the backend.
      </p>
      <div className='bio-item'>
        <img alt='Dot Kubisiak' className='portrait' src='kubiphoto.jpg' />
        <article>
          <h2>
            .Kubisiak
            <br />
            <a
              target='_blank'
              rel='noreferrer'
              href='https://www.linkedin.com/in/kubisiak/'
            >
              <img alt='linkedin' className='icon' src='linkedin.png' />
            </a>
            <a
              target='_blank'
              rel='noreferrer'
              href='https://github.com/mckubisiak'
            >
              <img alt='github' className='icon' src='github.png' />
            </a>
          </h2>
          <p>
            A queer trans Software Engineer. I love mutually developing with
            people and supporting everyone's common as well as individuals
            goals. Photography and{' '}
            <a href='https://docs.google.com/document/d/1Tb3ETGO7tTbJFjT9ZHOJqpmd-qvIyq-JAkz8kT4pQfY/edit'>
              Mutual Aid
            </a>{' '}
            are other avenues I like to participate in community.
          </p>
        </article>
      </div>

      <div className='bio-item'>
        <img
          alt='Isaac Ewing'
          className='portrait'
          src='https://media-exp1.licdn.com/dms/image/C4E03AQG9gSEPQJjNYg/profile-displayphoto-shrink_200_200/0/1620148404124?e=1639612800&v=beta&t=8EYusWPIEYkHQcmE9yfMwGtFij98CBlTcjFtvWAkkbo'
        />

        <article>
          <h2>
            Isaac Ewing
            <br />
            <a
              target='_blank'
              rel='noreferrer'
              href='https://www.linkedin.com/in/isaac-ewing-6ba3b5211/'
            >
              <img alt='linkedin' className='icon' src='linkedin.png' />
            </a>
            <a
              target='_blank'
              rel='noreferrer'
              href='https://github.com/Isaac-Ewing'
            >
              <img alt='github' className='icon' src='github.png' />
            </a>
          </h2>
          <p>
            I am a Full-stack Developer who loves to solve complex coding
            problems involving math. In my free time I enjoy playing various
            sports with my friends poorly, reading, and playing video games
            (also poorly). I originally became interested in programming when I
            decided that I didn't want to use my degree in Chemical Engineering,
            and within a few days of first writing code, I knew that I wanted to
            do it professionally.
          </p>
        </article>
      </div>
    </div>
  );
}
