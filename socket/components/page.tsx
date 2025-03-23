import React from 'react'

export const fetchAnimes = async (page: number) => {
    const res = await fetch(`https://shikimori.one/api/animes?page=${page}&limit=25&order=popularity`);
    const animes = await res.json();
    console.log(animes)
    return animes
}

export default fetchAnimes