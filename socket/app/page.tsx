"use client";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import fetchAnimes from '@/components/page'

export default function Home() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<{ content: string; id: string; robux: number }[]>([]);
  const [animes, setAnimes] = useState([]);
  const [fetchedItem, setFetchedItem] = useState<{ content: string | undefined; id?: string; robux?: number } | null>(
    null
  );
  const [currentUser, setCurrentUser] = useState<{ content: string | undefined; id: string; robux: number } | null>(
    null
  );
  const [password, setPassword] = useState("");
  const { ref, inView } = useInView();

  useEffect(() => {
    async function fetchItems() {
      const response = await fetch("http://localhost:5000");
      const items = await response.json();
      setItems(items);

      const res = await fetchAnimes(page);
      setAnimes(res);
    }
    fetchItems();
  }, []);

  // Infinite Scrolling Effect
  useEffect(() => {
    if (inView) {
      setPage((prev) => prev + 1);
    }
  }, [inView]);

  useEffect(() => {
    async function loadMoreAnimes() {
      const res = await fetchAnimes(page);
      setAnimes((prev) => [...prev, ...res])
    }
    if (page > 1) loadMoreAnimes();
  }, [page]);

  async function POSTItem() {
    try {
      if (fetchedItem?.content !== undefined) {
        const response = await fetch("http://localhost:5000", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fetchedItem),
        });
        const res = await response.json();
        setItems((prevItems) => [...prevItems, res]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function DELETEItem(id: string) {
    try {
      await fetch(`http://localhost:5000/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setItems((prevItems) => prevItems.filter((property) => id !== property.id));
      setCurrentUser(null);
    } catch (error) {
      console.error(error);
    }
  }

  async function LogIn(pass: string) {
    if (!currentUser) {
      const response = await fetch(`http://localhost:5000/${pass}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      const res = await response.json();
      setCurrentUser(res);
    } else {
      console.log("You are already logged in");
    }
  }

  async function Robux(userID: string) {
    if (currentUser !== null) {
      await fetch(`http://localhost:5000/${userID}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(currentUser),
      });
    }
  }

  return (
    <>
      <input className="text-black" type="text" onChange={(e) => setFetchedItem({ ...fetchedItem, content: e.target.value })} />
      <button onClick={POSTItem}>Send</button>
      <input type="text" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => LogIn(password)}>Log In</button>
      {Array.isArray(items) &&
        items.map((obj) => (
          <div key={obj.id} className="flex w-64 justify-around">
            <h1>{obj.content}</h1>
            <button onClick={() => DELETEItem(obj.id)}>delete</button>
          </div>
        ))}
      {currentUser !== null && (
        <div className="flex gap-5 items-center">
          <h1>Succesfully logged into: {currentUser.content}</h1>
          <h1>{currentUser.robux}</h1>
          <button
            className="bg-red-500 h-10 w-32 tracking-tight rounded-lg text-white font-medium hover:scale-110 transition-transform"
            onClick={() => setCurrentUser(null)}
          >
            Sign out
          </button>
          <button className="bg-yellow-400" onClick={() => Robux(currentUser.id)}>
            +
          </button>
        </div>
      )}
      {animes.map((anime, index) => (
        <div key={index}>
          <img className="object-cover" src={`https://shikimori.one/${anime.image.original}`} alt="" />
          <h1>{anime.name}</h1>
        </div>
      ))}
      <div ref={ref} className="h-10" /> {/* This triggers the Intersection Observer */}
    </>
  );
}