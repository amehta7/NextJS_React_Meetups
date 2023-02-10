//our-domain.com/meetupId => http://localhost:3000/meetupId

import React from "react";
import Head from "next/head";
import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/MeetupDetail";

const MeetupDetailPage = (props) => {
  return (
    <React.Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </React.Fragment>
  );
};

//all dynamic meetupIds
export const getStaticPaths = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://<username>:<password>@cluster0.a0wzikd.mongodb.net/MEETUPS?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetupIdData = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: "blocking", //fallback: true,
    paths: meetupIdData.map((m) => ({
      params: {
        meetupId: m._id.toString(),
      },
    })),
  };
};

export const getStaticProps = async (context) => {
  const meetupId = context.params.meetupId;

  console.log(meetupId);

  const client = await MongoClient.connect(
    "mongodb+srv://<username>:<password>@cluster0.a0wzikd.mongodb.net/MEETUPS?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const singleMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: singleMeetup._id.toString(),
        title: singleMeetup.title,
        address: singleMeetup.address,
        image: singleMeetup.image,
        description: singleMeetup.description,
      },
    },
  };
};
export default MeetupDetailPage;
