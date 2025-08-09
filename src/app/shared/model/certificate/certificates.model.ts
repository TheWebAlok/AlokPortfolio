export class Certificates {
  certificatesName!: string;
  description!: string;
  certificateLink!: string;
  imageURL!: string;
  createdAt!: Date;

  constructor(init?: Partial<Certificates>) {
    Object.assign(this, init);
  }
}
