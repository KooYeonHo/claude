import { useState } from 'react'
import { styled } from 'styled-components'

const ContactContainer = styled.div`
  padding: 5rem 2rem;
  max-width: 800px;
  margin: 0 auto;
`

const Title = styled.h2`
  font-size: 3rem;
  margin-bottom: 2rem;
  color: #ffffff;
`

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: #aaa6c3;
`

const FormContainer = styled.form`
  background-color: #151030;
  padding: 2rem;
  border-radius: 1rem;
  margin-top: 2rem;
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

const Label = styled.label`
  color: #ffffff;
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  background-color: #050816;
  border: 1px solid #333;
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #8352FD;
  }
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  background-color: #050816;
  border: 1px solid #333;
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 1rem;
  min-height: 150px;
  
  &:focus {
    outline: none;
    border-color: #8352FD;
  }
`

const Button = styled.button`
  background-color: #8352FD;
  color: #ffffff;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #6939d4;
  }
`

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기에 폼 제출 로직을 추가할 수 있습니다
    console.log('Form submitted:', formData);
    alert('감사합니다! 메시지가 전송되었습니다.');
    setFormData({ name: '', email: '', message: '' });
  };
  
  return (
    <ContactContainer>
      <Title>Contact</Title>
      <Description>
        궁금한 점이 있으시거나 협업을 원하신다면 언제든지 연락 주세요.
        최대한 빠르게 답변 드리겠습니다.
      </Description>
      
      <FormContainer onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">이름</Label>
          <Input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name}
            onChange={handleChange}
            required 
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">이메일</Label>
          <Input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="message">메시지</Label>
          <TextArea 
            id="message" 
            name="message" 
            value={formData.message}
            onChange={handleChange}
            required 
          />
        </FormGroup>
        
        <Button type="submit">전송하기</Button>
      </FormContainer>
    </ContactContainer>
  )
}

export default Contact 