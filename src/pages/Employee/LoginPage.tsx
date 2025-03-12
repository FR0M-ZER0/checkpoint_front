import React from 'react'
import TemplateWithFilter from './TemplateWithFilter'

function LoginPage() {
	return (
		<TemplateWithFilter filter={
			<div>
				<p>oi</p>
				
			</div>
		}>
			<div>
				<p>
					hello world
				</p>
			</div>
		</TemplateWithFilter>
	)
}

export default LoginPage