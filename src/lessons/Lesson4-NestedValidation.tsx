import { useState } from 'react';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const addressSchema = z.object({
  street: z.string().min(1, { message: "Street is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, { message: "Invalid ZIP code format" }),
});

const educationSchema = z.object({
  institution: z.string().min(1, { message: "Institution name is required" }),
  degree: z.string().min(1, { message: "Degree is required" }),
  graduationYear: z
    .number()
    .int()
    .min(1900, { message: "Year must be after 1900" })
    .max(new Date().getFullYear(), { message: "Year cannot be in the future" }),
});

const skillSchema = z.object({
  name: z.string().min(1, { message: "Skill name is required" }),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"], {
    errorMap: () => ({ message: "Please select a valid skill level" }),
  }),
});

const completeFormSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
  }),
  address: addressSchema,
  education: z.array(educationSchema)
    .min(1, { message: "At least one education entry is required" }),
  skills: z.array(skillSchema)
    .min(1, { message: "At least one skill is required" })
    .max(3, { message: "Maximum 3 skills allowed" }),
  additionalNotes: z.string().max(500, { message: "Notes cannot exceed 500 characters" }).optional(),
});

type CompleteFormData = z.infer<typeof completeFormSchema>;

export default function NestedValidation() {
  const [formData, setFormData] = useState<CompleteFormData | null>(null);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CompleteFormData>({
    resolver: zodResolver(completeFormSchema),
    defaultValues: {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
      },
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      education: [{ institution: '', degree: '', graduationYear: undefined as unknown as number }],
      skills: [{ name: '', level: undefined as unknown as "Beginner" | "Intermediate" | "Advanced" | "Expert" }],
      additionalNotes: '',
    }
  });

  const { 
    fields: educationFields, 
    append: appendEducation, 
    remove: removeEducation 
  } = useFieldArray({
    control,
    name: 'education',
  });

  const { 
    fields: skillFields, 
    append: appendSkill, 
    remove: removeSkill 
  } = useFieldArray({
    control,
    name: 'skills',
  });

  const onSubmit = (data: CompleteFormData) => {
    setFormData(data);
    console.log('Form submitted successfully:', data);
    // reset(); 
  };

  return (
    <div className="lesson-container">
      <h2>Lesson 4: Nested Objects & Arrays Validation</h2>
      <p className="lesson-description">
        This lesson demonstrates how to validate complex nested form structures with arrays of objects.
      </p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input
              id="firstName"
              type="text"
              {...register('personalInfo.firstName')}
            />
            {errors.personalInfo?.firstName && <p className="error-message">{errors.personalInfo.firstName.message}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input
              id="lastName"
              type="text"
              {...register('personalInfo.lastName')}
            />
            {errors.personalInfo?.lastName && <p className="error-message">{errors.personalInfo.lastName.message}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              {...register('personalInfo.email')}
            />
            {errors.personalInfo?.email && <p className="error-message">{errors.personalInfo.email.message}</p>}
          </div>
        </div>
        
        <div className="form-section">
          <h3>Address</h3>
          <div className="form-group">
            <label htmlFor="street">Street:</label>
            <input
              id="street"
              type="text"
              {...register('address.street')}
            />
            {errors.address?.street && <p className="error-message">{errors.address.street.message}</p>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City:</label>
              <input
                id="city"
                type="text"
                {...register('address.city')}
              />
              {errors.address?.city && <p className="error-message">{errors.address.city.message}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="state">State:</label>
              <input
                id="state"
                type="text"
                {...register('address.state')}
              />
              {errors.address?.state && <p className="error-message">{errors.address.state.message}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="zipCode">ZIP Code:</label>
              <input
                id="zipCode"
                type="text"
                {...register('address.zipCode')}
              />
              {errors.address?.zipCode && <p className="error-message">{errors.address.zipCode.message}</p>}
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Education</h3>
          {errors.education?.root && <p className="error-message">{errors.education.root.message}</p>}
          
          {educationFields.map((field, index) => (
            <div key={field.id} className="form-array-item">
              <div className="form-group">
                <label htmlFor={`education.${index}.institution`}>Institution:</label>
                <input
                  id={`education.${index}.institution`}
                  {...register(`education.${index}.institution` as const)}
                />
                {errors.education?.[index]?.institution && (
                  <p className="error-message">{errors.education[index]?.institution?.message}</p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor={`education.${index}.degree`}>Degree:</label>
                <input
                  id={`education.${index}.degree`}
                  {...register(`education.${index}.degree` as const)}
                />
                {errors.education?.[index]?.degree && (
                  <p className="error-message">{errors.education[index]?.degree?.message}</p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor={`education.${index}.graduationYear`}>Graduation Year:</label>
                <input
                  id={`education.${index}.graduationYear`}
                  type="number"
                  {...register(`education.${index}.graduationYear` as const, { valueAsNumber: true })}
                />
                {errors.education?.[index]?.graduationYear && (
                  <p className="error-message">{errors.education[index]?.graduationYear?.message}</p>
                )}
              </div>
              
              {index > 0 && (
                <button 
                  type="button" 
                  className="remove-button"
                  onClick={() => removeEducation(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            className="add-button"
            onClick={() => appendEducation({ institution: '', degree: '', graduationYear: undefined as unknown as number })}
          >
            Add Education
          </button>
        </div>
        
        <div className="form-section">
          <h3>Skills</h3>
          {errors.skills?.root && <p className="error-message">{errors.skills.root.message}</p>}
          
          {skillFields.map((field, index) => (
            <div key={field.id} className="form-array-item">
              <div className="form-group">
                <label htmlFor={`skills.${index}.name`}>Skill:</label>
                <input
                  id={`skills.${index}.name`}
                  {...register(`skills.${index}.name` as const)}
                />
                {errors.skills?.[index]?.name && (
                  <p className="error-message">{errors.skills[index]?.name?.message}</p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor={`skills.${index}.level`}>Level:</label>
                <select
                  id={`skills.${index}.level`}
                  {...register(`skills.${index}.level` as const)}
                >
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                {errors.skills?.[index]?.level && (
                  <p className="error-message">{errors.skills[index]?.level?.message}</p>
                )}
              </div>
              
              {index > 0 && (
                <button 
                  type="button" 
                  className="remove-button"
                  onClick={() => removeSkill(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          {skillFields.length < 5 && (
            <button
              type="button"
              className="add-button"
              onClick={() => appendSkill({ name: '', level: undefined as unknown as "Beginner" | "Intermediate" | "Advanced" | "Expert" })}
            >
              Add Skill
            </button>
          )}
        </div>
        
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="additionalNotes">Additional Notes (optional):</label>
            <textarea
              id="additionalNotes"
              {...register('additionalNotes')}
              rows={4}
            />
            {errors.additionalNotes && <p className="error-message">{errors.additionalNotes.message}</p>}
          </div>
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
          <li>We're validating nested objects (personalInfo, address)</li>
          <li>We're validating arrays of objects (education, skills)</li>
          <li>We use useFieldArray to handle dynamic form arrays</li>
          <li>Complex validation rules are applied to each level of nesting</li>
        </ul>
      </div>
    </div>
  );
} 