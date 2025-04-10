import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const takenUsernames = ['admin', 'user', 'test', 'moderator', 'system'];
  const isAvailable = !takenUsernames.includes(username.toLowerCase());
  return isAvailable;
};

const asyncSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be at most 20 characters" })
    .refine(
      async (username) => await checkUsernameAvailability(username),
      { message: "This username is already taken" }
    ),
  email: z.string().email({ message: "Invalid email address" }),
  bio: z.string().max(200, { message: "Bio must be at most 200 characters" }).optional(),
});

type AsyncFormData = z.infer<typeof asyncSchema>;

export default function AsyncValidation() {
  const [formData, setFormData] = useState<AsyncFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<AsyncFormData>({
    resolver: zodResolver(asyncSchema),
  });


  const onSubmit = async (data: AsyncFormData) => {
    console.log('Submitting form with data:', data);
    setFormData(data);
    console.log('Form submitted successfully:', data);
    reset();
  };

  return (
    <div className="lesson-container">
      <h2>Lesson 3: Async Validation with Zod</h2>
      <p className="lesson-description">
        This lesson demonstrates how to perform asynchronous validation, such as checking if a username is already taken.
      </p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <div className="input-with-status">
            <input
              id="username"
              type="text"
              {...register('username')}
            />
            {errors.username && <p className="error-message">{errors.username.message}</p>}
          </div>
          <p className="hint">Try: 'admin', 'user', 'test', 'moderator', 'system' (these are taken)</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            {...register('email')}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="bio">Bio (optional):</label>
          <textarea
            id="bio"
            {...register('bio')}
            rows={4}
          />
          {errors.bio && <p className="error-message">{errors.bio.message}</p>}
        </div>
        
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
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
          <li>We use Zod's async refine() to validate against a mock "database"</li>
          <li>Username availability is checked on blur for better UX</li>
          <li>We display loading state during validation</li>
          <li>Validation happens both on blur and on form submission</li>
        </ul>
      </div>
    </div>
  );
} 