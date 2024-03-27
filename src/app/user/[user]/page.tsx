"use client";

import React from "react";

const page = ({ params }: { params: { user: string } }) => {
  return (
    <main className="flex w-screen min-h-screen items-center flex-col overflow-x-hidden">
      <div className="w-screen flex items-center justify-center font-bold text-lg py-4">
        Dev-Box
      </div>
      <section className="flex-1 min-h-[90vh] w-[90%] flex flex-col gap-6 px-6 pb-6">
        <div className="flex sm:justify-between items-center flex-wrap gap-2 justify-center">
          <div className="name text-[clamp(25px,3.5vw,70px)] font-semibold">
            Tanmay Kumar
          </div>
          <button className="createRoomButton text-[clamp(15px,.9vw,40px)] px-4 py-2 rounded-md bg-white/30">
            Create Room
          </button>
        </div>
        <div className="content flex w-full h-max gap-4 items-center justify-around flex-col">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e, i) => {
            return <RoomCard key={i} />;
          })}
        </div>
      </section>
    </main>
  );
};

const RoomCard = () => {
  return (
    <div className="w-[full] md:w-[60%] max-w-[90vw] px-4 py-3 rounded-md bg-white/10 flex justify-between items-center flex-wrap gap-3">
      <div className="details">
        <div className="name">Room 1</div>
        <div className="desc text-sm text-white/50">some desc is here</div>
      </div>
      <div className="Buttons flex gap-3 text-sm">
        <button className="button px-4 py-2 bg-blue-400/15 rounded-md">
          Edit
        </button>
        <button className="button px-4 py-2 bg-red-400/15 rounded-md">
          Delete
        </button>
      </div>
    </div>
  );
};

export default page;
