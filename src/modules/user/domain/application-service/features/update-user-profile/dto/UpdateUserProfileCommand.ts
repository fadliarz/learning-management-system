import User from '../../../../domain-core/entity/User';

export default class UpdateUserProfileCommand {
  public executor: User;
  public avatar: string;
  public phoneNumber: string;
  public about: string;
  public dateOfBirth: string;
  public address: string;
  public bloodType: string;
  public medicalHistories: string[];
  public enrolledStudentUnits: string[];
  public hobbies: string[];
  public lineId: string;
  public emergencyNumber: string;
}
