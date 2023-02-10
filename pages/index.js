//our-domain.com => http://localhost:3000/

import { MongoClient } from "mongodb";
import React from "react";
import Head from "next/head";
import MeetupList from "../components/meetups/MeetupList";

const HomePage = (props) => {
  return (
    <React.Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </React.Fragment>
  );
};

//getServerSideProps runs for every request

// export const getServerSideProps = async (context) => {
//   const req = context.req;
//   const res = context.res;

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// };

//getStaticProps runs after every revalidate seconds(ex here 1 sec)

export const getStaticProps = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://<username>:<password>@cluster0.a0wzikd.mongodb.net/MEETUPS?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetupData = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetupData.map((m) => ({
        title: m.title,
        image: m.image,
        address: m.address,
        description: m.description,
        id: m._id.toString(),
      })),
    },
    revalidate: 1,
  };
};

export default HomePage;
