import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const advancedSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string(),
  age: z
    .number({ invalid_type_error: "Age must be a number" })
    .int({ message: "Age must be a whole number" })
    .positive({ message: "Age must be positive" })
    .min(18, { message: "You must be at least 18 years old" })
    .max(120, { message: "Age must be valid" }),
  termsAccepted: z
    .boolean()
    .refine(val => val === true, { message: "You must accept the terms and conditions" })
})
.refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type AdvancedFormData = z.infer<typeof advancedSchema>;

export default function AdvancedValidation() {
  const [formData, setFormData] = useState<AdvancedFormData | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AdvancedFormData>({
    resolver: zodResolver(advancedSchema),
    defaultValues: {
      termsAccepted: false
    }
  });

  const onSubmit = (data: AdvancedFormData) => {
    setFormData(data);
    console.log('Form submitted successfully:', data);
    reset();
  };

  return (
    <div className="lesson-container">
      <h2>Lesson 2: Advanced Zod Validation</h2>
      <p className="lesson-description">
        This lesson demonstrates more complex validations like password strength, age restrictions, and cross-field validation.
      </p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            {...register('username')}
          />
          {errors.username && <p className="error-message">{errors.username.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            {...register('password')}
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input
            id="age"
            type="number"
            {...register('age', { valueAsNumber: true })}
          />
          {errors.age && <p className="error-message">{errors.age.message}</p>}
        </div>
        
        <div className="form-group checkbox-group">
          <input
            id="termsAccepted"
            type="checkbox"
            {...register('termsAccepted')}
          />
          <label htmlFor="termsAccepted">I accept the terms and conditions</label>
          {errors.termsAccepted && <p className="error-message">{errors.termsAccepted.message}</p>}
        </div>
        
        <button type="submit" className="submit-button">Submit</button>
      </form>
      
      {formData && (
        <div className="result-container">
          <h3>Validated Data:</h3>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}

      <div className="code-explanation">
        <h3>What's happening:</h3>
        <ul>
          <li>We use multiple regex validations for password strength</li>
          <li>We demonstrate number validation with min/max and type checks</li>
          <li>We use refine() to implement custom validation logic (password matching)</li>
          <li>Boolean validation ensures terms are accepted</li>
        </ul>
      </div>
    </div>
  );
} 