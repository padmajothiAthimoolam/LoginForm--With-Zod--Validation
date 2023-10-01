import { useForm, useFieldArray, FieldErrors} from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { useEffect } from 'react';

let renderCount = 0;
type FormValues = {
    username: string;
    email: string;
    channel: string;
    social: { //nested object
        twitter: string,
        facebook: string
    };
    phoneNumbers:string[];
    phNumbers:{
        number:string;
    }[] //to collect multiple numbers
    age: Number;
    dateOfBirth: Date;
}
export const YouTubeForm = () =>{
   const form = useForm<FormValues>({
    defaultValues:{
        username:"batman",
        email:"",
        channel:"",
        social :{
            twitter:"",
            facebook:""
        },
        phoneNumbers:["",""],
        phNumbers:[{number: ""}],
        age: 0,
        dateOfBirth: new Date(),
    },
    mode : "onSubmit"  // other possible values onBlur/onTouched/OnChange/all
    //assigning default value from previous stored data
    // defaultValues : async () => {
    //     const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
    //     const data = await response.json();
    //     return {
    //         username: data.username,
    //         email: data.email,
    //         channel: ""
    //     }

    // }
   });

   const { register, control, handleSubmit, formState, watch, getValues, setValue, reset, trigger } = form;
   const { errors, touchedFields, dirtyFields, isDirty, isValid, isSubmitted, isSubmitting, isSubmitSuccessful, submitCount} = formState;
   console.log({touchedFields, dirtyFields, isDirty, isValid,  isSubmitted, isSubmitting, isSubmitSuccessful, submitCount});

   const {fields, append,remove } = useFieldArray ({
    name: 'phNumbers',
    control
   })

   const onSubmit = (data: FormValues) => {
    console.log("Form values", data);
   }

   //sideeffect after watching the value
   useEffect(()=> {
    const subscription = watch((value) => {
        console.log(value);
    });
    return () => subscription.unsubscribe();
   },[watch]);
   
   const onError = (errors: FieldErrors<FormValues>) =>{
    console.log("Form errors", errors);
   }

   const handleGetValues = () =>{
    console.log("Get Values", getValues(["username", "channel"]));
   }
   const handleSetValues = () => {
        setValue("username", "", {
            shouldValidate: true,   //optional object
            shouldDirty: true,
            shouldTouch: true
        })

    }
    useEffect(()=>{
        if(isSubmitSuccessful){
            reset();
        }
    },[isSubmitSuccessful, reset]);

   const watchUserName = watch(["username", "email"]);
    renderCount++;

    return (
       <div>
        <h1>Youtube Form ({renderCount/2})</h1> 
        {/* to avoid the traditional rendering of every keystroke */}
        <h2>Watched valeu"{ watchUserName }</h2>
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <div className="form-control">
                <label htmlFor="username">Username</label>
                <input type='text' id="username" {...register("username",
                {
                    required: {
                        value: true,
                        message: "UserName is required"
                    }
                })}/>
                <p className='error'>{errors.username?.message}</p>
            </div>
            <div className="form-control">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" 
                {...register("email",
                {
                    pattern : {
                        value:  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                        message: "Invalid Email format"
                    },
                    //validate as function
                    // validate: (fieldValue) => {
                    //     return (fieldValue !== "admin@example.com" || "Enter a different email address");
                    // }

                    //validate as object
                    validate : {
                        notAdmin : (fieldValue) => {
                            return(
                                fieldValue !== "admin@example.com" || "Enter a different email address"
                            );
                        },
                        notblackListed : (fieldValue) => {
                            return (
                                !fieldValue.endsWith(".ca") || "This domain is not supported"
                            );
                        }
                    }
                }
                )}/>
                <p className='error'>{errors.email?.message}</p>
            </div>
            <div className="form-control">
                <label htmlFor="channel">Channel</label>
                <input type="text" id="channel" {...register("channel", {required: "Channel is required"})}/>
                <p className='error'>{errors.channel?.message}</p>
            </div>
            <div className="form-control">
                <label htmlFor="age">Age</label>
                <input type="text" id="age" {...register("age", { valueAsNumber:true ,required: "Age is required"})}/>
                <p className='error'>{errors.age?.message}</p>
            </div>
            <div className="form-control">
                <label htmlFor="dateofBirth">Date of Birth</label>
                <input type="date" id="age" {...register("dateOfBirth", { valueAsDate: true,required: "Date of birth is required"})}/>
                <p className='error'>{errors.dateOfBirth?.message}</p>
            </div>
            <div className="form-control">
                <label htmlFor="twitter">Twitter</label>
                <input type="text" id="twitter" {...register("social.twitter")} />
            </div>
            <div className="form-control">
                <label htmlFor="facebook">Facebook</label>
                <input type="text" id="facebook" {...register("social.facebook")} />
            </div>
            <div className="form-control">
                <label htmlFor="primary-phone">Primary Phone</label>
                <input type="text" id="primary-phone" {...register("phoneNumbers.0")} />
            </div>
            <div className="form-control">
                <label htmlFor="secondary-phone">Secondary Phone</label>
                <input type="text" id="secondary-phone" {...register("phoneNumbers.1",{
                    // disabled: watch("channel") === "", //disable based on condtition
                })} />
            </div>
            <div className="form-control">
                <label>List of phone numbers</label>

                {fields.map((fields,index)=>{
                    return(
                        <div className='form-control' key={fields.id}>
                        <input type="text" {...register(`phNumbers.${index}.number` as const)}/>
                        {
                            index >0 && (
                                <button type="button" onClick={()=> remove(index)}>Remove</button>
                            )
                        }
                        </div>
                    )
                })}
                <button type="button" onClick={()=>append({number: ""})}>Add phone numbers</button>
            </div>
            <button type="submit" disabled={!isDirty || !isValid}>Submit</button>
            <button type="button" onClick={()=>trigger()}>Validate</button>
            <button type="button" onClick={()=>reset()}> Reset</button>
            <button type="button" onClick={()=>handleGetValues()}> Get values</button>
            <button type="button" onClick={()=>handleSetValues()}> Set values</button>
        </form>
        <DevTool control={control}/>
       </div>
    )
}