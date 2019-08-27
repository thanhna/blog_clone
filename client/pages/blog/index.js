import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Nav from '../../components/blog/layout/Nav'
const Blog = () => (
  <div>
    <Head>
      <title>Blog</title>
    </Head>
    <Nav />

    <div className='hero'>
      <h1 className='title'>Welcome t admino Next.js!</h1>
      <p className='description'>0
        To get started, edit <code>pages/index.js</code> and save to reload.
      </p>

      <div className='row'>
        <Link href='/'>
          <a className='card'>
            <h3>Getting Started &rarr;</h3>
            <p>Learn more about Next.js on GitHub and in their examples</p>
          </a>
        </Link>
      </div>
    </div>

    <style jsx>{`
      .hero {
        width: 100%;
        color: #333;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 80px;
        line-height: 1.15;
        font-size: 48px;
      }
      .title,
      .description {
        text-align: center;
      }
      .row {
        max-width: 880px;
        margin: 80px auto 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
      .card {
        padding: 18px 18px 24px;
        width: 220px;
        text-align: left;
        text-decoration: none;
        color: #434343;
        border: 1px solid #9b9b9b;
      }
      .card:hover {
        border-color: #067df7;
      }
      .card h3 {
        margin: 0;
        color: #067df7;
        font-size: 18px;
      }
      .card p {
        margin: 0;
        padding: 12px 0 0;
        font-size: 13px;
        color: #333;
      }
    `}</style>
  </div>
)

export default Blog