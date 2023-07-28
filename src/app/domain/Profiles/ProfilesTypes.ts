export interface IProfiles {
  userId: string;
  data: {
    name: string;
    gender: string;
    birthdate: Date;
    city: string;
  };
}

export interface IProfilesID {
  id: string;
  body: IProfiles;
}
