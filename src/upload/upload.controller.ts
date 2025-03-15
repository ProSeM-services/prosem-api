import {
	Body,
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadService } from './upload.service'

@Controller('upload')
export class UploadController {
	constructor(private readonly uploadService: UploadService) {}
	@Post()
	@UseInterceptors(FileInterceptor('file'))
	async upload(
		@UploadedFile()
		file: Express.Multer.File
	) {
		return await this.uploadService.upload(file.originalname, file.buffer)
	}

	@Post('/delete')
	async delete(
		@Body()
		{ fileName }: { fileName: string }
	) {
		return await this.uploadService.delete(fileName)
	}
}
