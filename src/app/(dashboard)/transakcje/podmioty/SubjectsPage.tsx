"use client";

import { SubjectT } from "@utils/db-actions/subject";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { RouteSegments } from "@utils/routes";

import { getSubjects } from "@services/subject/get";
import { Fab } from "@components/material/Fab";
import { IconButton } from "@components/material/IconButton";
import FormPageWrapper from "@components/layouts/FormPageWrapper";
import { useData } from "@context/DataContext";
import { Icon } from "@components/material/Icon";

export default function SubjectsPage() {
  const router = useRouter();
  const { user } = useData();

  const [subjects, setSubjects] = useState<SubjectT[]>([]);
  const [subjectsReady, setSubjectsReady] = useState<boolean>(false);

  useEffect(() => {
    if (user?.id) {
      getSubjects(user.id)
        .then((subjects) => setSubjects(subjects))
        .finally(() => setSubjectsReady(true));
    }
  }, [user?.id]);

  if (!user) return null;

  return (
    <FormPageWrapper>
      <div className="self-start flex flex-wrap justify-start items-start gap-[36px] w-full px-[113px] py-[30px] ">
        {subjectsReady &&
          subjects
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((subject) => <Subject key={subject.id} subject={subject} />)}
        <div className="absolute bottom-10 right-10">
          <Fab lowered onClick={() => router.push(`/${RouteSegments.Transactions}/${RouteSegments.Subjects}/${RouteSegments.New}`)}>
            <Icon slot="icon">add</Icon>
          </Fab>
        </div>
      </div>
    </FormPageWrapper>
  );
}

export function Subject({ subject }: { subject: SubjectT }) {
  const router = useRouter();

  const [hover, setHover] = useState(false);

  return (
    <div
      className="flex justify-between items-center w-[300px] h-[46px] px-[16px] py-[8px] rounded-2xl hover:shadow-sm hover:bg-surface"
      key={subject.id}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Icon className="text-primary fill">
        {subject.normal ? "person" : "atm"}
      </Icon>
      <div className="flex flex-col">
        <div className="flex justify-start items-center text-primary font-semibold text-[16px] w-[160px] pl-[10px]">
          {subject.name}
        </div>
        <div className="flex justify-start items-center text-on-surface-variant font-semibold text-[10px] w-[150px] pl-[10px]">
          {subject.address}
        </div>
      </div>
      <div
        className={`flex justify-between items-center w-[60px] h-full transition-opacity ${
          hover ? "opacity-100" : "opacity-0"
        }`}
      >
        <IconButton
          className="mini"
          onClick={() =>
            router.push(`/${RouteSegments.Transactions}/${RouteSegments.Subjects}/${RouteSegments.Edit}/${subject.id}`)
          }
        >
          <Icon>edit</Icon>
        </IconButton>
        <IconButton
          className="mini error"
          onClick={() =>
            router.push(`/${RouteSegments.Transactions}/${RouteSegments.Subjects}/${RouteSegments.Delete}/${subject.id}`)
          }
        >
          <Icon>delete</Icon>
        </IconButton>
      </div>
    </div>
  );
}
