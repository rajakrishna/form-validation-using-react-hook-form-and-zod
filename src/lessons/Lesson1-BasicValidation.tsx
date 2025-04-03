import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const basicSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" })
});

type BasicFormData = z.infer<typeof basicSchema>;

export default function BasicValidation() {
  const [formData, setFormData] = useState<BasicFormData | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<BasicFormData>({
    resolver: zodResolver(basicSchema)
  });

  const onSubmit = (data: BasicFormData) => {
    setFormData(data);
    console.log('Form submitted successfully:', data);
    reset();
  };

  return (
    <div className="lesson-container">
      <h2>Lesson 1: Basic Zod Validation</h2>
      <p className="lesson-description">
        This lesson demonstrates how to validate simple form fields like name and email using Zod.
      </p>
      
      <div className="form-card">
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className={errors.name ? "input-error" : ""}
              {...register('name')}
            />
            {errors.name && <p className="error-message">{errors.name.message}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              // type="email"
              placeholder="john@example.com"
              className={errors.email ? "input-error" : ""}
              {...register('email')}
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Form'}
          </button>
        </form>
      </div>
      
      {formData && (
        <div className="result-container">
          <h3>Validated Data:</h3>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}

      <div className="code-explanation">
        <h3>What's happening:</h3>
        <ul>
          <li>We define a Zod schema with validation rules for each field</li>
          <li>The schema is used with react-hook-form via zodResolver</li>
          <li>Zod ensures the name is at least 2 characters and the email is valid</li>
          <li>Error messages are automatically shown when validation fails</li>
        </ul>
      </div>
    </div>
  );
} 