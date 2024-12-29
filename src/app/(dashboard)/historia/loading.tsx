import Loading from "@components/Loading";

export default async function HistoryLoading() {
  return (
    <div className="flex justify-center items-center w-full h-full bg-surface rounded-tl-2xl shadow-sm">
      <Loading />
    </div>
  );
}
