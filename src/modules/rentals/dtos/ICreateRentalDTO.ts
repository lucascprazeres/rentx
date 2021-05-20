export interface ICreateRentalDTO {
  id?: string;
  car_id: string;
  user_id: string;
  expected_return_date: Date;
  total?: number;
  end_date?: Date;
}
