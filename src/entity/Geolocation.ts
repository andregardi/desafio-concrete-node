import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn
} from "typeorm";
import { User } from "./User";

@Entity()
export class Geolocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("double precision")
  latitude: number;

  @Column("double precision")
  longitude: number;

  @OneToOne(type => User, user => user.geolocation)
  @JoinColumn()
  user: User;

  static fromPoint(point: any) {
    const geolocation = new Geolocation();
    geolocation.latitude = point.coordinates[0];
    geolocation.longitude = point.coordinates[1];
    return geolocation;
  }

  toPoint() {
    return {
      type: "Point",
      coordinates: [this.latitude, this.longitude]
    };
  }
}
