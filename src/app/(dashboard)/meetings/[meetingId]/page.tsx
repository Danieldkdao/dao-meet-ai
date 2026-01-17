const MeetingIdPage = async ({
  params,
}: {
  params: Promise<{ meetingId: string }>;
}) => {
  const { meetingId } = await params;
  return <div>MeetingIdPage: {meetingId}</div>;
};

export default MeetingIdPage;
