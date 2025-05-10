<template>
    <div>
        <div class="content">			
            <el-form label-width="120px" :rules="rules" ref="ruleForm" :model="formData">
				<el-row>
					<el-col :span="24"> 
						<div style="margin-top: 20px;margin-bottom: 30px;text-align: center;font-size: 20px;" >南通N栋PLC地址转换为MCGS地址</div> 
					</el-col>
				</el-row>
                <el-row>	
                    <el-col :span="24">                        
                        <el-form-item label="选择文件">											
                            <div>
                                <el-upload class="upload-demo" drag :multiple="false"
                                    action="#" :auto-upload="false"
                                    :file-list="fileList"
                                    :on-remove="handleFileRemove"                                                                    
                                    :on-change="beforeUploadCheck">
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">将文件拖到此处，或点击上传</div>
                                    <div class="el-upload__tip" slot="tip">请上传csv文件</div>
                                </el-upload>
                            </div>							
                        </el-form-item>
                    </el-col>
                </el-row>
				<el-row>
					<el-col :span="24"> 
						<div style="margin-bottom: 20px;text-align: center;" >
							<el-button type="primary" size="medium" @click="handleFormConfirm">转换</el-button>
						</div> 						
					</el-col>
				</el-row>
            </el-form>            			
        </div>		
    </div>
</template>
<script>
	import * as XLSX from 'xlsx/xlsx.mjs'
	import { saveAs } from 'file-saver';
	import Papa from 'papaparse';
	import iconv from 'iconv-lite';
	import chardet from 'chardet';

	export default {
		name: "handleExcel11",
		// components:{
			
		// },

		data() {
			return {
				formData: {},
				rules:{},		
				fileList:[],
				tableData:[],
				fileName:'',

			}
		},
		computed:{
			
		},
		watch:{
			
		},
		methods: {
			resetUpload(){				
				this.fileList = [];
				this.tableData = [];
				this.fileName = "";
			},	
			handleFileRemove(file,fileList){
				this.resetUpload();
			},
			handleExceed(files, fileList) {
				
			},

			async handleSelect(){
				this.resetUpload();
			},
			handleFormConfirm() {
				//判断是否有可转换的数据
				if(this.tableData.length == 0){
					this.$alert('没有可转换的数据！', "提示", {
						confirmButtonText: '确定',
						type:"error",
						callback: () => {						
							
						}
					});
					return;
				}
				// 创建一个空的工作表
				var worksheet = XLSX.utils.aoa_to_sheet([]);
				XLSX.utils.sheet_add_aoa(worksheet, [['组态设备名称:设备0']], {origin: "A1"});
				XLSX.utils.sheet_add_aoa(worksheet, [['驱动库文件路径:c:\\mcgspro\\program\\drivers\\通用设备\\modbus\\modbustcp\\modbustcp_str.ui']], {origin: "A2"});
				XLSX.utils.sheet_add_aoa(worksheet, [['驱动构件名称:ModbusTCP']], {origin: "A3"});		
				XLSX.utils.sheet_add_aoa(worksheet, [['驱动构件版本:7.101']], {origin: "A4"});				
				//添加表头
				let header = [['通道号'],['变量名'],['变量类型'],['通道名称'],['读写类型'],['寄存器名称'],['数据类型'],['寄存器地址'],['地址偏移'],['通道采集频次'],['通道处理'],['信息备注']];
				header.forEach((item,index) => {
					XLSX.utils.sheet_add_aoa(worksheet, [item], {origin: {r: 4, c: index}});
				});		
				//添加列表数据
				const initRow = 5;
				this.tableData.forEach((item,index) => {
					XLSX.utils.sheet_add_aoa(worksheet, [[item.通道号]], {origin: {r: initRow+index, c: 0}});
					XLSX.utils.sheet_add_aoa(worksheet, [[item.变量名]], {origin: {r: initRow+index, c: 1}});
					XLSX.utils.sheet_add_aoa(worksheet, [[item.变量类型]], {origin: {r: initRow+index, c: 2}});
					XLSX.utils.sheet_add_aoa(worksheet, [[item.通道名称]], {origin: {r: initRow+index, c: 3}});
					XLSX.utils.sheet_add_aoa(worksheet, [[item.读写类型]], {origin: {r: initRow+index, c: 4}});
					XLSX.utils.sheet_add_aoa(worksheet, [[item.寄存器名称]], {origin: {r: initRow+index, c: 5}});
					XLSX.utils.sheet_add_aoa(worksheet, [[item.数据类型]], {origin: {r: initRow+index, c: 6}});
					XLSX.utils.sheet_add_aoa(worksheet, [[item.寄存器地址]], {origin: {r: initRow+index, c: 7}});
					XLSX.utils.sheet_add_aoa(worksheet, [[item.地址偏移]], {origin: {r: initRow+index, c: 8}});
					XLSX.utils.sheet_add_aoa(worksheet, [[item.通道采集频次]], {origin: {r: initRow+index, c: 9}});
					XLSX.utils.sheet_add_aoa(worksheet, [[item.通道处理]], {origin: {r: initRow+index, c: 10}});
					XLSX.utils.sheet_add_aoa(worksheet, [[item.信息备注]], {origin: {r: initRow+index, c: 11}});
				});

				// 将工作表转换为CSV格式的字符串
				var csv = XLSX.utils.sheet_to_csv(worksheet);
				// 转换为GB18030编码
				const gb18030Buffer = iconv.encode(csv, 'gb18030');
				// 创建Blob对象，并指定GB18030编码
				const blob = new Blob([gb18030Buffer], { type: 'text/csv;charset=gb18030;' });

				// 使用 file-saver 保存文件
				saveAs(blob, 'MCGS_'+this.fileName);

			},			
			//对选择的文件进行校验					
			beforeUploadCheck(file, fileList) {
				//重新上传前初始化数据
				this.tableData = [];
				this.fileName = "";							
				console.log("选择文件file",file);
				if (fileList.length > 1) {
					fileList.splice(0, 1);	// 将第一个删掉
				}
				this.fileList = fileList;
				const fileObj = file.raw;
				this.fileName = file.name;
				//校验文件
				const extension = file.name.split('.').pop().toLowerCase();
				if (extension !== 'csv') {
					this.$alert('文件格式须为csv格式！', this.$_t("Tip","提示"), {
						confirmButtonText: '确定',
						type:"error",
						callback: () => {						
							
						}
					});
					this.resetUpload();
					return false;
				}
		
				// 用readAsBinaryString或readAsArrayBuffer读取文件内容（根据xlsx版本可能需要不同方式）
				const reader = new FileReader();
				reader.onload = (e) => {					
					const data = new Uint8Array(e.target.result);

					// 使用 chardet 检测文件编码
					const encoding = chardet.detect(data);
					console.log(`Detected encoding: ${encoding}`);

					let decodedData;

					if (encoding.toLowerCase() === 'gb18030') {
						// 如果是 gb18030 编码
						decodedData = iconv.decode(data, 'gb18030');
					} else {
						// 否则假设是 UTF-8 编码
						decodedData = new TextDecoder('utf-8').decode(data);
					}
					// 使用 PapaParse 解析 CSV 数据
					const parsedData = Papa.parse(decodedData, {
						header: true, // 是否将第一行作为表头
						skipEmptyLines: true, // 跳过空行
						dynamicTyping: true, // 自动类型转换
					}).data;					
					console.log("Parsed CSV Data", parsedData);
					this.tableData = this.transformVariables(parsedData);	
					console.log("transformedData",this.tableData);

					if(this.tableData.length == 0){
						this.$alert('没有可转换的数据！', "提示", {
							confirmButtonText: '确定',
							type:"error",
							callback: () => {						
								
							}
						});
					}else{
						this.$confirm(`有${this.tableData.length}条数据待转换,是否立即转换?`, '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.handleFormConfirm();
						}).catch(() => {							        
						});
					}
					
				};				
				reader.readAsArrayBuffer(fileObj); // 读取为ArrayBuffer，适用于大多数情况				
			},			
			transformVariables(inputArray) {
				// 过滤掉数据类型不符合要求的项
				const filteredArray = inputArray.filter(item => {
					return ['BOOL', 'INT', 'DINT', 'UINT', 'UDINT', 'REAL'].includes(item.数据类型);
				});
				return filteredArray.map((item, index) => {
					const newItem = { ...item };
					// 增加通道号
					newItem.通道号 = index;
					// 替换变量名称中的 .
					newItem.变量名 = newItem.变量名称.replace(/\./g, '_');
					// 删除旧的变量名称键
					delete newItem.变量名称;
					// 增加变量类型
					newItem.变量类型 = this.determineVariableType(newItem.数据类型);
					// 转换地址并重命名为通道名称
					newItem.通道名称 = this.convertName(newItem.地址, newItem.数据类型);
					// 增加读写类型
					newItem.读写类型 = "读写";
					// 增加寄存器名称
					newItem.寄存器名称 = "[4区]输出寄存器";
					newItem.数据类型 = this.convertType(newItem.地址, newItem.数据类型);
					newItem.寄存器地址 = this.convertAddress(newItem.地址);
					// 删除旧的地址键
					delete newItem.地址;
					// 增加地址偏移
					newItem.地址偏移 = "";
					// 增加通道采集频次
					newItem.通道采集频次 = "1";
					// 增加通道处理
					newItem.通道处理 = "";
					// 增加通道处理
					newItem.信息备注 = newItem.描述;

					delete newItem.指向;
					delete newItem.初值;
					delete newItem.冷启动保持;
					delete newItem.分组名称;
					delete newItem.描述;

					return newItem;
				});
			},			
			convertName(address, dataType) {
				const addrNum = parseInt(address.match(/\d+/)[0], 10);
				const result = (addrNum / 2) + 1;
				const integerPart = Math.floor(result).toString().padStart(4, '0');
				
				// 提取原始地址的小数部分
				const decimalPartStr = address.split('.')[1] || '0';
				let decimalPart = parseInt(decimalPartStr, 10);
				// 如果整数部分是奇数，则给小数部分加8
				if(addrNum % 2 !== 0){
					decimalPart += 8;
				}
				const formattedDecimalPart = decimalPart.toString().padStart(2, '0');
				switch (dataType) {
					case "BOOL":					
						// 对于 BOOL 类型，保留小数点后两位，并确保整数部分长度为4位				
						return `读写4${integerPart}.${formattedDecimalPart}`;
					case "INT":
						// 对于 INT 类型，确保整数部分长度为4位					
						return `读写4WB${integerPart}`;
					case "DINT":
						// 对于 DINT 类型，确保整数部分长度为4位					
						return `读写4DB${integerPart}`;
					case "UINT":
						// 对于 UINT 类型，确保整数部分长度为4位					
						return `读写4WUB${integerPart}`;
					case "UDINT":
						// 对于 UDINT 类型，确保整数部分长度为4位					
						return `读写4DUB${integerPart}`;
					case "REAL":
						// 对于 REAL 类型，确保整数部分长度为4位					
						return `读写4DF${integerPart}`;
					default:
						return ""; // 如果有其他未知的数据类型
				}				
			},
			determineVariableType(dataType) {
				switch (dataType) {
					case "BOOL":					
						return "INTEGER";
					case "INT":
					case "DINT":
					case "UINT":
					case "UDINT":
					case "REAL":
						return "SINGLE";
					default:
						return ""; // 如果有其他未知的数据类型
				}
			},
			convertType(address, dataType) {
				const addrNum = parseInt(address.match(/\d+/)[0], 10);
				// 提取原始地址的小数部分
				const decimalPartStr = address.split('.')[1] || '0';
				let decimalPart = parseInt(decimalPartStr, 10);
				// 如果整数部分是奇数，则给小数部分加8
				if(addrNum % 2 !== 0){
					decimalPart += 8;
				}
				const formattedDecimalPart = decimalPart.toString().padStart(2, '0');
				switch (dataType) {
					case "BOOL":									
						return `通道的第${formattedDecimalPart}位`;
					case "INT":				
						return `16位 有符号二进制`;
					case "DINT":					
						return `32位 有符号二进制`;
					case "UINT":					
						return `16位 无符号二进制`;
					case "UDINT":					
						return `32位 无符号二进制`;
					case "REAL":					
						return `32位 浮点数`;
					default:
						return ""; 
				}				
			},
			convertAddress(address) {
				const addrNum = parseInt(address.match(/\d+/)[0], 10);
				const result = (addrNum / 2) + 1;
				const integerPart = Math.floor(result).toString();
				return `${integerPart}`;								
			},
			

		},
		mounted() {
			
		}
	};
</script>


<style scoped>
	::v-deep .el-upload__tip {
		color: rgba(245, 17, 17, 1);
	}
	
	::v-deep .el-form-item__content {
		line-height: 20px;
		display: flex;
	}
	.content{
		/* width:500px; */
	}
	::v-deep .el-button{
		width: 100px;
	}
</style>
