import type { LoaderFunctionArgs } from 'react-router-dom';
import { getGang, getRecruitment, getRecruitmentPosition } from '~/api';
import type { GangDto, RecruitmentDto, RecruitmentPositionDto } from '~/dto';

export type RecruitmentLoader = {
  recruitment: RecruitmentDto | undefined;
};

export type GangLoader = {
  gang: GangDto | undefined;
};

export type PositionLoader = {
  position: RecruitmentPositionDto | undefined;
};

export async function recruitmentLoader({ params }: LoaderFunctionArgs): Promise<RecruitmentLoader> {
  return { recruitment: (await getRecruitment(params.recruitmentId as string)).data };
}

export async function positionLoader({ params }: LoaderFunctionArgs): Promise<PositionLoader> {
  return { position: (await getRecruitmentPosition(params.positionId as string)).data };
}

export async function gangLoader({ params }: LoaderFunctionArgs): Promise<GangLoader> {
  return { gang: await getGang(params.gangId as string) };
}

export async function recruitmentGangLoader(params: LoaderFunctionArgs): Promise<RecruitmentLoader & GangLoader> {
  return { ...(await recruitmentLoader(params)), ...(await gangLoader(params)) };
}

export async function recruitmentGangPositionLoader(
  params: LoaderFunctionArgs,
): Promise<RecruitmentLoader & GangLoader & PositionLoader> {
  return { ...(await recruitmentLoader(params)), ...(await gangLoader(params)), ...(await positionLoader(params)) };
}
