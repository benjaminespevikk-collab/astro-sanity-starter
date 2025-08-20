import React, { useEffect, useMemo, useRef, useState } from "react";

// 📱 NLA Idrettslag App – gratis nett/app-versjon
// Funksjoner: Treningstider, Medlemskap, Påmelding, Nyheter
// Kan kjøres i nettleser og legges til som ikon på mobil

const KEY = "nla_idrett_v1";

function useLocalState(defaultValue) {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultValue;
      const parsed = JSON.parse(raw);
      return { ...defaultValue, ...parsed };
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  return [data, setData];
}

function classNames(...c) {
  return c.filter(Boolean).join(" ");
}

function Header({ title, subtitle }) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-zinc-500">{subtitle}</p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">NLA</span>
      </div>
    </header>
  );
}

function Tabs({ value, onChange, items }) {
  return (
    <nav className="max-w-3xl mx-auto px-2 mt-3">
      <div className="flex gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
        {items.map((it) => (
          <button
            key={it.value}
            onClick={() => onChange(it.value)}
            className={classNames(
              "flex-1 px-3 py-2 text-sm rounded-lg transition",
              value === it.value
                ? "bg-white dark:bg-zinc-900 shadow border border-zinc-200 dark:border-zinc-700"
                : "opacity-70 hover:opacity-100"
            )}
          >
            {it.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function Empty({ title, children }) {
  return (
    <div className="text-center py-10 text-zinc-500">
      <p className="font-medium">{title}</p>
      <p className="text-sm mt-1">{children}</p>
    </div>
  );
}

function TrainingsView({ trainings, setTrainings }) {
  const [text, setText] = useState("");

  function addTraining(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setTrainings([{ id: crypto.randomUUID(), text, createdAt: Date.now() }, ...trainings]);
    setText("");
  }
  function remove(id) { setTrainings(trainings.filter(t => t.id !== id)); }

  return (
    <section className="max-w-3xl mx-auto px-4">
      <form onSubmit={addTraining} className="flex gap-2 my-4">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Legg til treningstid (eks. Futsal – Mandag kl 18)" className="flex-1 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700" />
        <button type="submit" className="px-4 py-2 rounded-xl bg-black text-white">Legg til</button>
      </form>
      {trainings.length === 0 ? (
        <Empty title="Ingen treningstider enda">Legg til klubbens treninger 👇</Empty>
      ) : (
        <ul className="grid gap-3">
          {trainings.map((t) => (
            <li key={t.id} className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between">
              <span>{t.text}</span>
              <button onClick={() => remove(t.id)} className="text-xs text-red-600">Slett</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function MembersView({ members, setMembers }) {
  const [name, setName] = useState("");
  function addMember(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setMembers([{ id: crypto.randomUUID(), name, joinedAt: Date.now() }, ...members]);
    setName("");
  }
  function remove(id) { setMembers(members.filter(m => m.id !== id)); }

  return (
    <section className="max-w-3xl mx-auto px-4">
      <form onSubmit={addMember} className="flex gap-2 my-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Skriv inn nytt medlem" className="flex-1 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700" />
        <button type="submit" className="px-4 py-2 rounded-xl bg-black text-white">Legg til</button>
      </form>
      {members.length === 0 ? (
        <Empty title="Ingen medlemmer enda">Registrer klubbens medlemmer 👇</Empty>
      ) : (
        <ul className="grid gap-3">
          {members.map((m) => (
            <li key={m.id} className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between">
              <span>{m.name}</span>
              <button onClick={() => remove(m.id)} className="text-xs text-red-600">Slett</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function NewsView({ news, setNews }) {
  const [text, setText] = useState("");
  function addNews(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setNews([{ id: crypto.randomUUID(), text, createdAt: Date.now() }, ...news]);
    setText("");
  }
  function remove(id) { setNews(news.filter(n => n.id !== id)); }

  return (
    <section className="max-w-3xl mx-auto px-4">
      <form onSubmit={addNews} className="flex gap-2 my-4">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Nyhet eller oppdatering" className="flex-1 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700" />
        <button type="submit" className="px-4 py-2 rounded-xl bg-black text-white">Publiser</button>
      </form>
      {news.length === 0 ? (
        <Empty title="Ingen nyheter enda">Publiser klubbens oppdateringer 👇</Empty>
      ) : (
        <ul className="grid gap-3">
          {news.map((n) => (
            <li key={n.id} className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between">
              <span>{n.text}</span>
              <button onClick={() => remove(n.id)} className="text-xs text-red-600">Slett</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function NLAApp() {
  const [store, setStore] = useLocalState({
    trainings: [],
    members: [],
    news: [],
  });

  const [tab, setTab] = useState("trainings");

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-50">
      <Header title="NLA Idrettslag" subtitle="Trening, medlemmer og nyheter" />

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: "trainings", label: "Treningstider" },
          { value: "members", label: "Medlemmer" },
          { value: "news", label: "Nyheter" },
        ]}
      />

      <main className="py-6">
        {tab === "trainings" && (
          <TrainingsView trainings={store.trainings} setTrainings={(t) => setStore((s) => ({ ...s, trainings: t }))} />
        )}
        {tab === "members" && (
          <MembersView members={store.members} setMembers={(m) => setStore((s) => ({ ...s, members: m }))} />
        )}
        {tab === "news" && (
          <NewsView news={store.news} setNews={(n) => setStore((s) => ({ ...s, news: n }))} />
        )}
      </main>

      <footer className="max-w-3xl mx-auto px-4 py-8 text-xs text-zinc-500">
        Laget for NLA Idrettslag ⚽🏐🏓
      </footer>
    </div>
  );
}
