import { ChangeDetectorRef, Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { completeExerciseForm } from 'src/app/interfaces/completeExercise';
import { completeFoodForm } from 'src/app/interfaces/completeFood';
import { AddFoodDataService } from 'src/app/services/add-food-data.service';
import { ConfirmPlanService } from 'src/app/services/confirm-plan.service';
import { SharedDataService } from 'src/app/services/shared-data.service';


@Component({
  selector: 'app-plan-today',
  templateUrl: './plan-today.component.html',
  styleUrls: ['./plan-today.component.css']
})
export class PlanTodayComponent {

  constructor(
    private afAuth: AngularFireAuth,
    private foodService: AddFoodDataService,
    private sds: SharedDataService,
    private cp: ConfirmPlanService,
    private route: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.plans = [];
  }

  plans: any[];
  currentUserEmail = '';
  todayDate = '';
  errorLoading: boolean = false;
  today = new Date();
  todayPlan: any;
  bf: any;
  bfKcal: any;
  lunch: any;
  lunchKcal: any;
  dinner: any;
  dinnerKcal: any;
  snacks: any;
  snacksKcal: any;
  cardio: string = '';
  cardioKcal: number = 0;
  resistance: string = '';
  resistanceKcal: number = 0;
  notes: string = ''
  planDate = ''
  future = false;

  completeForm: completeFoodForm = {
    food: '',
    kcal: 0,
    date: new Date(),
    mealTime: '',
    method: 'original',
    user: '',
    userEmail: '',
    ISOdate: '',
  }

  sendData = {
    type: '',
    date: '',
  }

  completeExercise: completeExerciseForm = {
    exercise: '',
    kcal: 0,
    date: new Date(),
    type: '',
    method: 'original',
    user: '',
    userEmail: '',
    ISOdate: '',
  }

  ngOnInit(): void {

    this.afAuth.authState.subscribe(user => {
      if (user && user.email) {
        this.currentUserEmail = user.email
        this.completeForm.userEmail = this.currentUserEmail
        this.completeExercise.userEmail = this.currentUserEmail
        // const userDetails = this.sds.getUserDetails()
        // this.completeForm.user = userDetails.userName
        // this.completeExercise.user = userDetails.userName
      }
      this.todayDate = this.today.toISOString().split('T')[0], this.today

      this.foodService.loadAllPlans(this.currentUserEmail).subscribe((val: any) => {
        const allPlans = val;
        //console.log(allPlans)
        for (let i = 0; i < allPlans.length; i++) {
          this.plans.push(allPlans[i].foodDate)
        }
        //console.log(this.plans)
        this.loadPlan()
      })
    })
  }



  loadPlan() {
    if (this.plans.includes(this.todayDate)) {
      this.errorLoading = false
      this.foodService.loadPlan(this.todayDate, this.currentUserEmail)
        .subscribe(val => {
          this.todayPlan = val[0]
          console.log(this.todayPlan)
          this.planDate = this.todayPlan.foodDate;
          console.log(this.planDate)
          this.bf = this.todayPlan.breakfastFood
          this.bfKcal = this.todayPlan.breakfastKcal
          this.lunch = this.todayPlan.lunchFood
          this.lunchKcal = this.todayPlan.lunchKcal
          this.dinner = this.todayPlan.dinnerFood
          this.dinnerKcal = this.todayPlan.dinnerKcal
          this.snacks = this.todayPlan.snacks
          this.snacksKcal = this.todayPlan.snacksKcal
          this.cardio = this.todayPlan.cardio
          this.cardioKcal = this.todayPlan.cardioKcal
          this.resistance = this.todayPlan.resistance
          this.resistanceKcal = this.todayPlan.resistanceKcal
          if (this.todayPlan.notesReq) {
            this.notes = this.todayPlan.notes
          }
          else {
            this.notes = '';
          }
        })
    }
    else {
      this.errorLoading = true;
    }
    const userDetails = this.sds.getUserDetails()
    this.completeForm.user = userDetails.userName
    this.completeExercise.user = userDetails.userName
    //console.log(this.completeForm.user)
  }


  sendID(foodTime: string) {
    this.sendData.date = this.planDate
    switch (foodTime) {
      case 'breakfast':
        this.sendData.type = 'breakfast';
        break;
      case 'lunch':
        this.sendData.type = 'lunch';
        break;
      case 'dinner':
        this.sendData.type = 'dinner';
        break;
      case 'snacks':
        this.sendData.type = 'snacks';
        break;
      case 'resistance':
        this.sendData.type = 'resistance';
        break;
      case 'cardio':
        this.sendData.type = 'cardio';
        break;
    }
    this.sds.setFoodTime(this.sendData)
  }

  completedFood(foodTime: any) {
    this.completeExercise.ISOdate = this.planDate
    this.completeForm.ISOdate = this.planDate
    switch (foodTime) {
      case 'breakfast':
        this.completeForm.food = this.bf
        this.completeForm.kcal = this.bfKcal
        this.completeForm.mealTime = 'breakfast'
        this.cp.confirmFood(this.completeForm)
        break;
      case 'lunch':
        this.completeForm.food = this.lunch
        this.completeForm.kcal = this.lunchKcal
        this.completeForm.mealTime = 'lunch'
        this.cp.confirmFood(this.completeForm)
        break;
      case 'dinner':
        this.completeForm.food = this.dinner
        this.completeForm.kcal = this.dinnerKcal
        this.completeForm.mealTime = 'dinner'
        this.cp.confirmFood(this.completeForm)
        break;
      case 'snacks':
        this.completeForm.food = this.snacks
        this.completeForm.kcal = this.snacksKcal
        this.completeForm.mealTime = 'snacks'
        this.cp.confirmFood(this.completeForm)
        break;
      case 'cardio':
        this.completeExercise.exercise = this.cardio
        this.completeExercise.kcal = this.cardioKcal
        this.completeExercise.type = 'cardio'
        console.log(this.completeExercise, 'cardio')
        this.cp.confirmExercise(this.completeExercise)
        break;
      case 'resistance':
        this.completeExercise.exercise = this.resistance
        this.completeExercise.kcal = this.resistanceKcal
        this.completeExercise.type = 'resistance'
        console.log(this.completeExercise, 'LOOK HERE!')
        this.cp.confirmExercise(this.completeExercise)
        break;
    }
  }

  goBack(today: string) {
    const date = new Date(today)
    date.setTime(date.getTime() - 86400000)
    if(date>new Date()){
      this.future = true;
    }
    else{
      this.future = false;
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0')
    this.todayDate = `${year}-${month}-${day}`
    //const currentDate = new Date(this.planDate)
    this.loadPlan()
    if (this.plans.includes(this.todayDate)) {
      this.errorLoading = false;
    }
    else {
      this.errorLoading = true;
    }
  }

  goForward(today: string) {
    const date = new Date(today)
    date.setTime(date.getTime() + 86400000)
    if(date>new Date()){
      this.future = true;
    }
    else{
      this.future = false;
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0')
    this.todayDate = `${year}-${month}-${day}`
    this.loadPlan()
    if (this.plans.includes(this.todayDate)) {
      this.errorLoading = false;
    }
    else {
      this.errorLoading = true;
    }
  }
}
